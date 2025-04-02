import sqlite3

def init_db():
    conn = sqlite3.connect("users.db")
    with open("init.sql", "r", encoding="utf-8") as f:
        conn.executescript(f.read())
    conn.commit()
    conn.close()
    print("Base de données initialisée.")

if __name__ == "__main__":
    init_db()
