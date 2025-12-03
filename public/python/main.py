from backend.simconnect_mobiflight import SimConnectMobiFlight
from backend.mobiflight_variable_requests import MobiFlightVariableRequests
from time import sleep
import keyboard

class MobiflightClient:
    def __init__(self):
        self.sm = SimConnectMobiFlight()
        self.vr = MobiFlightVariableRequests(self.sm)
        self.vr.clear_sim_variables()

    def add_var(self, var_string: str):
        cmd = f"MF.SimVars.Add.({var_string})"
        self.vr.set(cmd)

    def read(self, var_string: str):
        return self.vr.get(f"({var_string})")
    

    def write(self, var_or_event_string: str, value=None):
        if value is None:
            cmd = f"({var_or_event_string})"
        elif isinstance(value, str) and ':' in value:
            vtype, vval = value.split(':', 1)
            vtype = vtype.lower()
            vval = vval.strip().upper()
            match vtype:
                case "bool":
                    cmd_value = 1 if vval in ("UP", "ON", "TRUE", "1") else -1 if vval in ("DOWN", "OFF", "FALSE", "0") else None
                case "signal":
                    cmd_value = 1 if vval in ("UP", "1") else -1 if vval in ("DOWN", "0") else None
                case "int":
                    try: cmd_value = int(vval)
                    except ValueError: raise ValueError(f"Invalid int value: {vval}")
                case "float":
                    try: cmd_value = float(vval)
                    except ValueError: raise ValueError(f"Invalid float value: {vval}")
                case _:
                    raise ValueError(f"Unsupported type: {vtype}")
            if cmd_value is None:
                raise ValueError(f"Invalid {vtype} value: {vval}")
            cmd = f"{cmd_value} (>{var_or_event_string})"
        else:
            cmd = f"{value} (>{var_or_event_string})"
        print(f"Sending command: {cmd}")
        self.vr.set(cmd)


client = MobiflightClient()

client.write("L:A32NX_GEAR_LEVER_POSITION_REQUEST",'signal:DOWN')
print(client.read("_AUTOPILOT_APPR_MODE"))