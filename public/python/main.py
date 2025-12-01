from simconnect_mobiflight import SimConnectMobiFlight
from mobiflight_variable_requests import MobiFlightVariableRequests
from time import sleep

sm = SimConnectMobiFlight()
vr = MobiFlightVariableRequests(sm)
vr.clear_sim_variables()

# Example write variable
vr.set("0 (>L:A32NX_COCKPIT_DOOR_LOCKED)")

while True:
    alt_ground = vr.get("(A:GROUND ALTITUDE,Meters)")
    alt_plane = vr.get("(A:PLANE ALTITUDE,Feet)")
    # FlyByWire A320
    ap1 = vr.get("(L:A32NX_AUTOPILOT_1_ACTIVE)")
    hdg = vr.get("(L:A32NX_AUTOPILOT_HEADING_SELECTED)")
    mode = vr.get("(L:A32NX_FMA_LATERAL_MODE)")
    sleep(1)