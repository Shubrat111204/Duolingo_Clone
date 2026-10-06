import os, re, unicodedata
from datetime import date, datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import func
from models import *
from seed import seed

HEART_SECS, REFILL_COST = 300, 350   # 1 heart / 5 min, or refill with gems (mocked purchase)

app = FastAPI(title="Duolingo Clone API")
app.add_middleware(CORSMiddleware, allow_origins=os.getenv("CORS_ORIGINS", "*").split(","), allow_methods=["*"], allow_headers=["*"])
Base.metadata.create_all(engine)
with Session() as _s:
    seed(_s)


def db():
    with Session() as s:
        yield s


def me(s): return s.query(User).filter_by(is_me=1).one()
def today(u): return date.today() + timedelta(days=u.day_offset)


def norm(t):
    t = "".join(c for c in unicodedata.normalize("NFD", t.lower()) if unicodedata.category(c) != "Mn")
    return " ".join(re.sub(r"[^\w\s]", "", t).split())


def regen(u):
    now = datetime.utcnow()
    if u.hearts >= 5:
        u.hearts_at = now; return
    n = int((now - u.hearts_at).total_seconds() // HEART_SECS)
    if n > 0:
        u.hearts = min(5, u.hearts + n)
        u.hearts_at = now if u.hearts >= 5 else u.hearts_at + timedelta(seconds=n * HEART_SECS)


def dto(s, u):
    regen(u); t = today(u)
    xp_today = s.query(func.coalesce(func.sum(XPLog.xp), 0)).filter_by(user_id=u.id, day=t).scalar()
    streak = u.streak if u.last_active and (t - u.last_active).days <= 1 else 0
    nxt = max(0, HEART_SECS - int((datetime.utcnow() - u.hearts_at).total_seconds())) if u.hearts < 5 else 0
    s.commit()
    return dict(id=u.id, name=u.name, xp=u.xp, streak=streak, hearts=u.hearts, gems=u.gems,
                daily_goal=u.daily_goal, today_xp=xp_today, next_heart_in=nxt)


@app.get("/api/me")
def get_me(s=Depends(db)): return dto(s, me(s))


@app.get("/api/path")
def get_path(s=Depends(db)):
    u = me(s)
    done = {r[0] for r in s.query(UserLesson.lesson_id).filter_by(user_id=u.id)}
    out, unlocked, cur = [], True, None
    for un in s.query(Unit).order_by(Unit.position):
        sk = []
        for k in un.skills:
            d = sum(l.id in done for l in k.lessons)
            state = "completed" if d == len(k.lessons) else ("available" if unlocked else "locked")
            if state != "completed": unlocked = False
            is_cur = state == "available" and cur is None
            if is_cur: cur = k.id
            nl = next((l.id for l in k.lessons if l.id not in done), k.lessons[0].id)
            sk.append(dict(id=k.id, title=k.title, icon=k.icon, state=state, done=d, total=len(k.lessons), next_lesson_id=nl, current=is_cur))
        out.append(dict(id=un.id, position=un.position, title=un.title, description=un.description, color=un.color, skills=sk))
    return out


@app.get("/api/lessons/{lid}")
def get_lesson(lid: int, s=Depends(db)):
    l = s.get(Lesson, lid)
    if not l: raise HTTPException(404, "Lesson not found")
    return dict(id=l.id, skill=l.skill.title, exercises=[dict(id=e.id, type=e.type, prompt=e.prompt, data=e.data) for e in l.exercises])


class Answer(BaseModel): answer: str


@app.post("/api/exercises/{eid}/check")
def check(eid: int, b: Answer, s=Depends(db)):
    e = s.get(Exercise, eid)
    if not e: raise HTTPException(404, "Exercise not found")
    return dict(correct=norm(b.answer) == norm(e.answer), solution=e.answer)


@app.post("/api/hearts/lose")
def lose_heart(s=Depends(db)):
    u = me(s); regen(u)
    if u.hearts == 5: u.hearts_at = datetime.utcnow()
    u.hearts = max(0, u.hearts - 1); s.commit()
    return dto(s, u)


@app.post("/api/hearts/refill")
def refill(s=Depends(db)):
    u = me(s)
    if u.gems < REFILL_COST: raise HTTPException(400, "Not enough gems")
    u.gems -= REFILL_COST; u.hearts = 5; s.commit()
    return dto(s, u)


class Done(BaseModel): mistakes: int = 0


@app.post("/api/lessons/{lid}/complete")
def complete(lid: int, b: Done, s=Depends(db)):
    u, l = me(s), s.get(Lesson, lid)
    if not l: raise HTTPException(404, "Lesson not found")
    xp = max(5, 15 - 2 * b.mistakes) + (5 if b.mistakes == 0 else 0)
    if not s.query(UserLesson).filter_by(user_id=u.id, lesson_id=lid).first():
        s.add(UserLesson(user_id=u.id, lesson_id=lid, xp_earned=xp))
    t = today(u)
    s.add(XPLog(user_id=u.id, day=t, xp=xp)); u.xp += xp; u.gems += 5
    if u.last_active != t:   # streak: +1 if active yesterday, else restart at 1
        u.streak = u.streak + 1 if u.last_active and (t - u.last_active).days == 1 else 1
        u.last_active = t
    s.commit()
    return dict(xp=xp, user=dto(s, u))


@app.post("/api/debug/next-day")
def next_day(s=Depends(db)):
    u = me(s); u.day_offset += 1; s.commit()
    return dto(s, u)


@app.get("/api/leaderboard")
def leaderboard(s=Depends(db)):
    users = s.query(User).order_by(User.xp.desc()).all()
    return [dict(rank=i + 1, name=u.name, xp=u.xp, me=bool(u.is_me)) for i, u in enumerate(users)]


@app.get("/api/profile")
def profile(s=Depends(db)):
    u = me(s); d = dto(s, u); t = today(u)
    lessons = s.query(UserLesson).filter_by(user_id=u.id).count()
    week = []
    for i in range(6, -1, -1):
        day = t - timedelta(days=i)
        x = s.query(func.coalesce(func.sum(XPLog.xp), 0)).filter_by(user_id=u.id, day=day).scalar()
        week.append(dict(day=day.strftime("%a"), xp=x))
    ach = [("🔥", "Wildfire", "Reach a 3 day streak", d["streak"] >= 3), ("⚡", "Sage", "Earn 100 XP", u.xp >= 100),
           ("📚", "Scholar", "Complete 5 lessons", lessons >= 5), ("🎯", "Goal getter", "Hit your daily goal", d["today_xp"] >= u.daily_goal),
           ("👑", "Champion", "Earn 500 XP", u.xp >= 500), ("🏆", "Top 3", "Reach the top 3", False)]
    ach[5] = ("🏆", "Top 3", "Reach the top 3", s.query(User).filter(User.xp > u.xp).count() < 3)
    return dict(user=d, lessons=lessons, week=week, achievements=[dict(icon=a, title=b, desc=c, unlocked=x) for a, b, c, x in ach])
