import ctypes
import time

# Load SimConnect.dll
simconnect = ctypes.windll.LoadLibrary("SimConnect.dll")

# Define constants
SIMCONNECT_CLIENT_DATA_TYPE_LVAR = 0  # L:Var data type

# Open connection
hSimConnect = ctypes.c_void_p()
result = simconnect.SimConnect_Open(ctypes.byref(hSimConnect), b"PythonLVar", 0, None, 0)
if result != 0:
    print("SimConnect connection failed")
    exit(1)

# Helper: Read L:Var
def get_lvar(name: str):
    buffer = ctypes.c_double()
    size = ctypes.c_uint32(ctypes.sizeof(buffer))
    # Use SimConnect_TransmitClientEvent/SimConnect_RequestData for L:Var
    # (You can use SimConnect_RequestClientData + L:Var name)
    # This requires more ctypes boilerplate (callbacks, events)
    # For simplicity, use third-party lib: https://github.com/cboulay/py-simconnect
    return 0  # placeholder

while True:
    # This is the part where you request L:Var value
    val = get_lvar("A32NX_GEAR_LEVER_POSITION")
    print("Gear handle:", val)
    time.sleep(0.2)
