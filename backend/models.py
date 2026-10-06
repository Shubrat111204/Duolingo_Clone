import os
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, JSON, Date, DateTime, UniqueConstraint
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

engine = create_engine(os.getenv("DATABASE_URL", "sqlite:///./duolingo.db"), connect_args={"check_same_thread": False})
Session = sessionmaker(engine, expire_on_commit=False)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    is_me = Column(Integer, default=0)            # the default logged-in learner
    xp = Column(Integer, default=0)
    streak = Column(Integer, default=0)
    last_active = Column(Date)
    hearts = Column(Integer, default=5)
    hearts_at = Column(DateTime)                  # last heart regen tick
    gems = Column(Integer, default=500)
    daily_goal = Column(Integer, default=20)
    day_offset = Column(Integer, default=0)       # lets reviewers simulate "next day"


class Unit(Base):
    __tablename__ = "units"
    id = Column(Integer, primary_key=True)
    position = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    color = Column(String, default="#58cc02")
    skills = relationship("Skill", back_populates="unit", order_by="Skill.position")


class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True)
    unit_id = Column(Integer, ForeignKey("units.id"), nullable=False)
    position = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    icon = Column(String, default="⭐")
    unit = relationship("Unit", back_populates="skills")
    lessons = relationship("Lesson", back_populates="skill", order_by="Lesson.position")


class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True)
    skill_id = Column(Integer, ForeignKey("skills.id"), nullable=False)
    position = Column(Integer, nullable=False)
    skill = relationship("Skill", back_populates="lessons")
    exercises = relationship("Exercise", back_populates="lesson", order_by="Exercise.position")


class Exercise(Base):
    __tablename__ = "exercises"
    id = Column(Integer, primary_key=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    position = Column(Integer, nullable=False)
    type = Column(String, nullable=False)         # choice | wordbank | match | fill | type
    prompt = Column(String, nullable=False)
    data = Column(JSON, default=dict)             # options / word bank / pairs
    answer = Column(String, nullable=False)       # never sent to the client
    lesson = relationship("Lesson", back_populates="exercises")


class UserLesson(Base):
    __tablename__ = "user_lessons"
    __table_args__ = (UniqueConstraint("user_id", "lesson_id"),)
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)
    xp_earned = Column(Integer, default=0)


class XPLog(Base):
    __tablename__ = "xp_log"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    day = Column(Date, nullable=False, index=True)
    xp = Column(Integer, nullable=False)
