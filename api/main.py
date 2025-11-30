# /api/main.py (Append at the end)

@app.get("/")
async def root():
    return {"message": "Welcome to ContractCoach API"}
