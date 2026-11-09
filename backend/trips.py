
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from database import get_connection
from auth import get_current_user


router = APIRouter(
    prefix="/trips",
    tags=["Trips"]
)


class TripRequest(BaseModel):
    route_id: int
    pickup_point_id: int
    fare_period_id: int


# =========================================
# REQUEST A TRIP
# POST /trips/
# =========================================

@router.post("/")
def request_trip(
    data: TripRequest,
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "Passenger":
        raise HTTPException(
            status_code=403,
            detail="Only passengers can request trips."
        )

    user_id = current_user["id"]

    conn = get_connection()

    try:
        with conn.cursor() as cursor:

            # FIND PASSENGER PROFILE
            cursor.execute(
                """
                SELECT id
                FROM passenger_profiles
                WHERE user_id = %s
                """,
                (user_id,)
            )

            passenger = cursor.fetchone()

            if not passenger:
                raise HTTPException(
                    status_code=404,
                    detail="Passenger profile not found."
                )

            passenger_id = passenger[0]

            # CHECK ROUTE EXISTS
            cursor.execute(
                """
                SELECT id, transport_type_id
                FROM routes
                WHERE id = %s
                """,
                (data.route_id,)
            )

            route = cursor.fetchone()

            if not route:
                raise HTTPException(
                    status_code=404,
                    detail="Route not found."
                )

            route_id = route[0]
            transport_type_id = route[1]

            # CHECK PICKUP POINT BELONGS TO ROUTE
            cursor.execute(
                """
                SELECT pickup_point_id
                FROM route_pickup_points
                WHERE route_id = %s
                  AND pickup_point_id = %s
                """,
                (
                    data.route_id,
                    data.pickup_point_id
                )
            )

            pickup_point = cursor.fetchone()

            if not pickup_point:
                raise HTTPException(
                    status_code=400,
                    detail="Pickup point does not belong to this route."
                )

            # GET FARE
            cursor.execute(
                """
                SELECT fare
                FROM route_fares
                WHERE route_id = %s
                  AND transport_type_id = %s
                  AND fare_period_id = %s
                """,
                (
                    route_id,
                    transport_type_id,
                    data.fare_period_id
                )
            )

            fare = cursor.fetchone()

            if not fare:
                raise HTTPException(
                    status_code=404,
                    detail="Fare not found for this route and period."
                )

            trip_fare = fare[0]

            # CREATE TRIP
            cursor.execute(
                """
                INSERT INTO trips (
                    passenger_id,
                    route_id,
                    pickup_point_id,
                    fare,
                    status
                )
                VALUES (%s, %s, %s, %s, 'Requested')
                RETURNING id, passenger_id, route_id,
                          pickup_point_id, fare, status,
                          requested_at
                """,
                (
                    passenger_id,
                    route_id,
                    data.pickup_point_id,
                    trip_fare
                )
            )

            trip = cursor.fetchone()

            conn.commit()

            return {
                "message": "Trip requested successfully.",
                "trip": {
                    "id": trip[0],
                    "passenger_id": trip[1],
                    "route_id": trip[2],
                    "pickup_point_id": trip[3],
                    "fare": trip[4],
                    "status": trip[5],
                    "requested_at": trip[6]
                }
            }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        print("Trip request error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to request trip."
        )

    finally:
        conn.close()


# =========================================
# GET ALL TRIPS FOR A PASSENGER
# GET /trips/passenger/{user_id}
# =========================================

@router.get("/passenger/{user_id}")
def get_passenger_trips(
    user_id: int,
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "Passenger":
        raise HTTPException(
            status_code=403,
            detail="Only passengers can access passenger trips."
        )

    if current_user["id"] != user_id:
        raise HTTPException(
            status_code=403,
            detail="You cannot access another passenger's trips."
        )

    conn = get_connection()

    try:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT id
                FROM passenger_profiles
                WHERE user_id = %s
                """,
                (user_id,)
            )

            passenger = cursor.fetchone()

            if not passenger:
                raise HTTPException(
                    status_code=404,
                    detail="Passenger profile not found."
                )

            passenger_id = passenger[0]

            # GET PASSENGER TRIPS
            cursor.execute(
                """
                SELECT
                    trips.id,
                    trips.fare,
                    trips.status,
                    trips.requested_at,
                    from_location.name,
                    to_location.name,
                    transport_types.name,
                    pickup_points.name
                FROM trips

                JOIN routes
                    ON trips.route_id = routes.id

                JOIN locations AS from_location
                    ON routes.from_location_id = from_location.id

                JOIN locations AS to_location
                    ON routes.to_location_id = to_location.id

                JOIN transport_types
                    ON routes.transport_type_id = transport_types.id

                JOIN pickup_points
                    ON trips.pickup_point_id = pickup_points.id

                WHERE trips.passenger_id = %s

                ORDER BY trips.requested_at DESC
                """,
                (passenger_id,)
            )

            trip_rows = cursor.fetchall()

            trips = []

            for trip in trip_rows:
                trips.append({
                    "id": trip[0],
                    "fare": trip[1],
                    "status": trip[2],
                    "requested_at": trip[3],
                    "from_location": trip[4],
                    "to_location": trip[5],
                    "transport": trip[6],
                    "pickup_point": trip[7]
                })

            return trips

    except HTTPException:
        raise

    except Exception as error:
        print("Get passenger trips error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to load passenger trips."
        )

    finally:
        conn.close()


# =========================================
# GET ONE TRIP WITH FULL DETAILS
# GET /trips/passenger/{user_id}/{trip_id}
# =========================================

@router.get("/passenger/{user_id}/{trip_id}")
def get_passenger_trip_details(
    user_id: int,
    trip_id: int,
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] != "Passenger":
        raise HTTPException(
            status_code=403,
            detail="Only passengers can access passenger trip details."
        )

    if current_user["id"] != user_id:
        raise HTTPException(
            status_code=403,
            detail="You cannot access another passenger's trip."
        )

    conn = get_connection()

    try:
        with conn.cursor() as cursor:

            cursor.execute(
                """
                SELECT
                    trips.id,
                    trips.fare,
                    trips.status,
                    trips.requested_at,
                    trips.accepted_at,
                    trips.driver_arrived_at,
                    trips.started_at,
                    trips.completed_at,
                    trips.cancelled_at,
                    trips.cancellation_reason,

                    from_location.name,
                    to_location.name,
                    transport_types.name,
                    pickup_points.name,

                    driver_user.full_name,
                    driver_user.phone,
                    driver_profiles.rating,

                    vehicles.plate_number,
                    vehicles.vehicle_model,
                    vehicles.vehicle_color

                FROM trips

                JOIN passenger_profiles
                    ON trips.passenger_id = passenger_profiles.id

                JOIN routes
                    ON trips.route_id = routes.id

                JOIN locations AS from_location
                    ON routes.from_location_id = from_location.id

                JOIN locations AS to_location
                    ON routes.to_location_id = to_location.id

                JOIN transport_types
                    ON routes.transport_type_id = transport_types.id

                JOIN pickup_points
                    ON trips.pickup_point_id = pickup_points.id

                LEFT JOIN driver_profiles
                    ON trips.driver_id = driver_profiles.id

                LEFT JOIN users AS driver_user
                    ON driver_profiles.user_id = driver_user.id

                LEFT JOIN vehicles
                    ON trips.vehicle_id = vehicles.id

                WHERE trips.id = %s
                  AND passenger_profiles.user_id = %s
                """,
                (trip_id, user_id)
            )

            trip = cursor.fetchone()

            if not trip:
                raise HTTPException(
                    status_code=404,
                    detail="Trip not found."
                )

            return {
                "id": trip[0],
                "fare": trip[1],
                "status": trip[2],
                "requested_at": trip[3],
                "accepted_at": trip[4],
                "driver_arrived_at": trip[5],
                "started_at": trip[6],
                "completed_at": trip[7],
                "cancelled_at": trip[8],
                "cancellation_reason": trip[9],

                "from_location": trip[10],
                "to_location": trip[11],
                "transport": trip[12],
                "pickup_point": trip[13],

                "driver": {
                    "name": trip[14],
                    "phone": trip[15],
                    "rating": trip[16]
                } if trip[14] else None,

                "vehicle": {
                    "plate_number": trip[17],
                    "model": trip[18],
                    "color": trip[19]
                } if trip[17] else None
            }

    except HTTPException:
        raise

    except Exception as error:
        print("Get trip details error:", error)

        raise HTTPException(
            status_code=500,
            detail="Failed to load trip details."
        )

    finally:
        conn.close()
