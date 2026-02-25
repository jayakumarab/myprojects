from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from routers import users, auth, activity
import models
import auth as auth_utils

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Enterprise Backend API",
    description="High-availability three-tier architecture backend with RBAC."
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(activity.router)

@app.get("/health")
def health_check():
    """Health check endpoint for Kubernetes liveness/readiness probes"""
    return {"status": "ok"}

# Startup event to create a default admin user if none exists
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        admin_user = db.query(models.User).filter(models.User.role == models.RoleEnum.admin).first()
        if not admin_user:
            print("Creating default admin user: admin@example.com / admin123")
            hashed_pw = auth_utils.get_password_hash("admin123")
            new_admin = models.User(
                username="admin",
                email="admin@example.com",
                hashed_password=hashed_pw,
                role=models.RoleEnum.admin
            )
            db.add(new_admin)
            db.commit()
    finally:
        db.close()
