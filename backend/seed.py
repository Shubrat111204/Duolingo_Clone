import random
from datetime import date, timedelta, datetime
from models import *

COURSE = [
    ("Say hello", "Greet people and order basics", "#58cc02", [
        ("Greetings", "👋", [("hola", "hello"), ("adiós", "goodbye"), ("gracias", "thank you"), ("por favor", "please")],
         [("hola buenos días", "hello good morning"), ("gracias y adiós", "thank you and goodbye")]),
        ("Food", "🍎", [("el pan", "the bread"), ("el agua", "the water"), ("la leche", "the milk"), ("la manzana", "the apple")],
         [("yo bebo agua", "I drink water"), ("ella come pan", "she eats bread")]),
        ("People", "🧑", [("el niño", "the boy"), ("la niña", "the girl"), ("el hombre", "the man"), ("la mujer", "the woman")],
         [("el niño come pan", "the boy eats bread"), ("la mujer bebe agua", "the woman drinks water")]),
    ]),
    ("Around town", "Animals, places and colors", "#ce82ff", [
        ("Animals", "🐶", [("el perro", "the dog"), ("el gato", "the cat"), ("el pájaro", "the bird"), ("el pez", "the fish")],
         [("el perro bebe agua", "the dog drinks water"), ("yo tengo un gato", "I have a cat")]),
        ("Places", "🏠", [("la casa", "the house"), ("la escuela", "the school"), ("la calle", "the street"), ("el parque", "the park")],
         [("yo voy a la escuela", "I go to school"), ("el niño está en el parque", "the boy is in the park")]),
        ("Colors", "🎨", [("rojo", "red"), ("azul", "blue"), ("verde", "green"), ("amarillo", "yellow")],
         [("la manzana es roja", "the apple is red"), ("el gato es azul", "the cat is blue")]),
    ]),
]


def build(vocab, sents, i, rnd):
    items = vocab[:]; rnd.shuffle(items)
    def choice(es, en):
        opts = [en] + rnd.sample([v[1] for v in vocab if v[1] != en], 2); rnd.shuffle(opts)
        return ("choice", f'Which of these means "{es}"?', {"options": opts}, en)
    def wordbank(es, en):
        words = es.split(); extra = rnd.sample([w for w in ["un", "pero", "muy", "también"] if w not in words], 2)
        bank = words + extra; rnd.shuffle(bank)
        return ("wordbank", en, {"bank": bank}, es)
    def fill(es, en):
        words = es.split(); ans = words[-1]
        opts = [ans] + rnd.sample([w for w in ["casa", "libro", "rojo", "agua", "perro"] if w != ans], 2); rnd.shuffle(opts)
        return ("fill", " ".join(words[:-1] + ["____"]), {"options": opts, "hint": en}, ans)
    s0, s1 = sents[i % 2], sents[(i + 1) % 2]
    return [choice(*items[0]), choice(*items[1]), ("match", "Tap the matching pairs", {"pairs": vocab}, "match"),
            wordbank(*s0), fill(*s1), ("type", items[2][1], {"hint": "Type this in Spanish"}, items[2][0]),
            choice(*items[3]), wordbank(*s1)]


def seed(s):
    if s.query(User).count():
        return
    rnd = random.Random(7)
    for up, (title, desc, color, skills) in enumerate(COURSE, 1):
        unit = Unit(position=up, title=title, description=desc, color=color); s.add(unit); s.flush()
        for sp, (st, icon, vocab, sents) in enumerate(skills, 1):
            sk = Skill(unit_id=unit.id, position=sp, title=st, icon=icon); s.add(sk); s.flush()
            for li in range(2):
                l = Lesson(skill_id=sk.id, position=li + 1); s.add(l); s.flush()
                for p, (t, prompt, data, ans) in enumerate(build(vocab, sents, li, rnd), 1):
                    s.add(Exercise(lesson_id=l.id, position=p, type=t, prompt=prompt, data=data, answer=ans))
    today = date.today()
    me = User(name="Shubrat", is_me=1, xp=120, streak=3, last_active=today - timedelta(days=1), hearts=5, hearts_at=datetime.utcnow())
    s.add(me)
    names = ["Aarav", "Mia", "Kenji", "Sofía", "Liam", "Priya", "Noah", "Zoe", "Omar"]
    for n in names:
        s.add(User(name=n, xp=rnd.randint(40, 400), streak=rnd.randint(0, 20), hearts_at=datetime.utcnow()))
    s.flush()
    for d, x in [(3, 30), (2, 40), (1, 50)]:
        s.add(XPLog(user_id=me.id, day=today - timedelta(days=d), xp=x))
    s.add(UserLesson(user_id=me.id, lesson_id=1, xp_earned=20))
    s.commit()
