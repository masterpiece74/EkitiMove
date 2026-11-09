
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection
from auth import router as auth_router
from trips import router as trips_router
from profile import router as profile_router

app = FastAPI()

# =========================================
# ROUTERS
# =========================================

app.include_router(auth_router)
app.include_router(trips_router)
app.include_router(profile_router)


# =========================================
# CORS CONFIGURATION
# =========================================

frontend_url = os.getenv("FRONTEND_URL", "").rstrip("/")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
]

if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================
# HOME
# =========================================

@app.get("/")
def read_root():
    return {
        "message": "Welcome to EkitiMove API"
    }


# =========================================
# LOCATIONS
# =========================================

@app.get("/locations")
def get_locations():
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT id, name, state
                FROM locations
                ORDER BY name
            """)

            locations = cursor.fetchall()

        return [
            {
                "id": location[0],
                "name": location[1],
                "state": location[2]
            }
            for location in locations
        ]

    finally:
        conn.close()


# =========================================
# ROUTES
# =========================================

@app.get("/routes")
def get_routes(
    from_location: str | None = None,
    to_location: str | None = None,
    transport: str | None = None
):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:

            query = """
                SELECT
                    r.id,
                    from_location.name AS from_location,
                    to_location.name AS to_location,
                    tt.name AS transport,
                    rf.fare,
                    pp.name AS pickup,
                    fp.name AS fare_period

                FROM routes r

                JOIN locations from_location
                    ON r.from_location_id = from_location.id

                JOIN locations to_location
                    ON r.to_location_id = to_location.id

                JOIN transport_types tt
                    ON r.transport_type_id = tt.id

                JOIN route_fares rf
                    ON r.id = rf.route_id
                    AND r.transport_type_id = rf.transport_type_id

                JOIN fare_periods fp
                    ON rf.fare_period_id = fp.id

                JOIN route_pickup_points rpp
                    ON r.id = rpp.route_id

                JOIN pickup_points pp
                    ON rpp.pickup_point_id = pp.id

                WHERE rpp.is_primary = TRUE
            """

            parameters = []

            if from_location:
                query += " AND from_location.name = %s"
                parameters.append(from_location)

            if to_location:
                query += " AND to_location.name = %s"
                parameters.append(to_location)

            if transport:
                query += " AND tt.name = %s"
                parameters.append(transport)

            query += """
                ORDER BY
                    r.id,
                    fp.id
            """

            cursor.execute(query, parameters)
            routes = cursor.fetchall()

        return [
            {
                "id": route[0],
                "from": route[1],
                "to": route[2],
                "transport": route[3],
                "fare": route[4],
                "pickup": route[5],
                "fare_period": route[6]
            }
            for route in routes
        ]

    finally:
        conn.close()


# =========================================
# ROUTE PICKUP POINTS
# =========================================

@app.get("/routes/{route_id}/pickup-points")
def get_route_pickup_points(route_id: int):
    conn = get_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute("""
                SELECT
                    pp.id,
                    pp.name,
                    pp.address,
                    pp.latitude,
                    pp.longitude,
                    rpp.is_primary

                FROM route_pickup_points rpp

                JOIN pickup_points pp
                    ON rpp.pickup_point_id = pp.id

                WHERE rpp.route_id = %s
                  AND pp.is_active = TRUE

                ORDER BY
                    rpp.is_primary DESC,
                    pp.name
            """, (route_id,))

            pickup_points = cursor.fetchall()

        return [
            {
                "id": point[0],
                "name": point[1],
                "address": point[2],
                "latitude": point[3],
                "longitude": point[4],
                "is_primary": point[5]
            }
            for point in pickup_points
        ]

    finally:
        conn.close()
