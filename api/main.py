import os
import sqlite3

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DB = os.environ.get("DB_PATH", "aawaz.db")
SKILLS = ["Fraction comparison", "Adding fractions", "Equivalent fractions", "Fraction as part of whole"]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https://.*\.vercel\.app|http://localhost:\d+",
    allow_methods=["*"],
    allow_headers=["*"],
)


def db():
    con = sqlite3.connect(DB)
    con.execute("CREATE TABLE IF NOT EXISTS mastery (student TEXT, skill TEXT, score REAL, PRIMARY KEY (student, skill))")
    return con


def clamp(x: float) -> float:
    return round(max(0.0, min(1.0, x)), 2)


def get_mastery(student: str) -> dict:
    # ponytail: SQLite on Render free tier resets on redeploy; Postgres when data must survive
    with db() as con:
        con.executemany("INSERT OR IGNORE INTO mastery VALUES (?, ?, 0.3)", [(student, s) for s in SKILLS])
        return dict(con.execute("SELECT skill, score FROM mastery WHERE student = ?", (student,)).fetchall())


def bump(student: str, skill: str, delta: float) -> dict:
    scores = get_mastery(student)
    with db() as con:
        con.execute("UPDATE mastery SET score = ? WHERE student = ? AND skill = ?",
                    (clamp(scores.get(skill, 0.3) + delta), student, skill))
    return get_mastery(student)


class Update(BaseModel):
    skill: str
    delta: float


@app.get("/health")
def health():
    return {"ok": True}


@app.get("/mastery/{student}")
def mastery(student: str):
    return get_mastery(student)


@app.post("/mastery/{student}")
def update_mastery(student: str, u: Update):
    return bump(student, u.skill, u.delta)


if __name__ == "__main__":
    assert clamp(1.4) == 1.0 and clamp(-1) == 0.0
    import tempfile
    DB = os.path.join(tempfile.mkdtemp(), "t.db")
    assert bump("t", SKILLS[0], 0.15)[SKILLS[0]] == 0.45
    print("ok")
