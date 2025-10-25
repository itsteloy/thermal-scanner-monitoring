# ESP32 Thermal Camera Server

This Arduino sketch creates a WiFi access point and WebSocket server for the AMG8833 thermal camera, allowing the React web application to receive real-time thermal data.

## Hardware Requirements

- ESP32 development board
- AMG8833 thermal camera module
- Jumper wires
- USB cable for programming and power

## Wiring Instructions

Connect the AMG8833 to the ESP32 using I2C:

| AMG8833 Pin | ESP32 Pin |
|-------------|-----------|
| VIN         | 3.3V      |
| GND         | GND       |
| SDA         | GPIO 21   |
| SCL         | GPIO 22   |

## Software Requirements

1. Arduino IDE
2. Required Libraries:
   - WiFi (built-in with ESP32 board support)
   - [WebSocketsServer](https://github.com/Links2004/arduinoWebSockets)
   - [Adafruit_AMG88xx](https://github.com/adafruit/Adafruit_AMG88xx)
   - [ArduinoJson](https://arduinojson.org/)

## Setup Instructions

1. Install the ESP32 board support in Arduino IDE:
   - Open Arduino IDE
   - Go to File > Preferences
   - Add `https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json` to Additional Board Manager URLs
   - Go to Tools > Board > Boards Manager
   - Search for "esp32" and install "ESP32 by Espressif Systems"

2. Install required libraries:
   - Go to Tools > Manage Libraries
   - Search for and install:
     - "WebSocket Server" by Markus Sattler
     - "Adafruit AMG88xx Library"
     - "ArduinoJson" by Benoit Blanchon

3. Configure Arduino IDE:
   - Select your ESP32 board from Tools > Board menu
   - Select the correct port from Tools > Port menu

4. Upload the sketch:
   - Open `esp32_thermal_server.ino`
   - Click the Upload button or press Ctrl+U

## Usage

1. Power on the ESP32
2. Look for WiFi network "ESP32_Thermal"
3. Connect using password: "12345678"
4. The web application should automatically connect to ws://192.168.4.1:81

## Troubleshooting

1. If the thermal camera is not detected:
   - Check the wiring connections
   - Verify the I2C address (default is 0x69)
   - Try running an I2C scanner sketch to verify communication

2. If WiFi network is not visible:
   - Check if the ESP32 is powered properly
   - Try resetting the ESP32
   - Verify the code was uploaded successfully

3. If WebSocket connection fails:
   - Ensure you're connected to the ESP32_Thermal WiFi network
   - Verify your device has an IP in the 192.168.4.x range
   - Check the serial monitor for connection status 