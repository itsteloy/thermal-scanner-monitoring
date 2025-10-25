#include <WiFi.h>
#include <WebSocketsServer.h>
#include <Wire.h>
#include <Adafruit_AMG88xx.h>
#include <ArduinoJson.h>

// WiFi credentials
const char *ssid = "ESP32_Thermal";
const char *password = "12345678";

// Create WebSocket server on port 81
WebSocketsServer webSocket = WebSocketsServer(81);

// Initialize AMG8833 thermal camera
Adafruit_AMG88xx amg;

// Buffer for JSON string
StaticJsonDocument<1024> doc;
char jsonBuffer[1024];

// Debug LED pin (built-in LED)
const int LED_PIN = 2;

// Status variables
bool sensorInitialized = false;
bool wifiInitialized = false;
unsigned long lastReadingTime = 0;
const unsigned long READ_INTERVAL = 100; // 100ms between readings

void setup()
{
  // Initialize serial communication
  Serial.begin(115200);
  while (!Serial)
    delay(10);
  Serial.println("\nESP32 Thermal Camera Server Starting...");

  // Initialize debug LED
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // Initialize I2C with explicit pins
  Wire.begin(21, 22);
  Wire.setClock(100000); // Set to 100kHz for stability

  // Try to initialize the thermal camera multiple times
  int retries = 0;
  while (!sensorInitialized && retries < 5)
  {
    Serial.print("Attempting to initialize AMG8833 (attempt ");
    Serial.print(retries + 1);
    Serial.println("/5)...");

    if (amg.begin())
    {
      sensorInitialized = true;
      Serial.println("AMG8833 sensor initialized successfully!");
      digitalWrite(LED_PIN, HIGH); // Turn on LED when sensor is ready
    }
    else
    {
      Serial.println("Failed to initialize AMG8833 sensor. Checking I2C bus...");

      // Scan I2C bus
      byte error, address;
      int nDevices = 0;

      for (address = 1; address < 127; address++)
      {
        Wire.beginTransmission(address);
        error = Wire.endTransmission();

        if (error == 0)
        {
          Serial.print("I2C device found at address 0x");
          if (address < 16)
            Serial.print("0");
          Serial.println(address, HEX);
          nDevices++;
        }
      }

      if (nDevices == 0)
      {
        Serial.println("No I2C devices found - check wiring!");
      }

      retries++;
      delay(1000);
    }
  }

  if (!sensorInitialized)
  {
    Serial.println("Failed to initialize AMG8833 after multiple attempts.");
    // Blink LED rapidly to indicate sensor initialization failure
    for (int i = 0; i < 10; i++)
    {
      digitalWrite(LED_PIN, HIGH);
      delay(100);
      digitalWrite(LED_PIN, LOW);
      delay(100);
    }
  }

  // Set up WiFi Access Point regardless of sensor status
  Serial.println("Setting up WiFi Access Point...");
  WiFi.softAP(ssid, password);

  IPAddress IP = WiFi.softAPIP();
  Serial.print("AP IP address: ");
  Serial.println(IP);
  wifiInitialized = true;

  // Start WebSocket server
  webSocket.begin();
  webSocket.onEvent(webSocketEvent);
  Serial.println("WebSocket server started");

  // Give the sensor time to initialize
  delay(100);
}

void loop()
{
  webSocket.loop();

  // Only read sensor if initialized and enough time has passed
  if (sensorInitialized && (millis() - lastReadingTime >= READ_INTERVAL))
  {
    float pixels[AMG88xx_PIXEL_ARRAY_SIZE];

    // Try to read pixels
    amg.readPixels(pixels);

    // Create 8x8 grid for thermal data
    float grid[8][8];
    float maxTemp = -100;
    float minTemp = 100;
    float sum = 0;

    for (int i = 0; i < 8; i++)
    {
      for (int j = 0; j < 8; j++)
      {
        int pixelIndex = i * 8 + j;
        grid[i][j] = pixels[pixelIndex];

        // Update min/max/average calculations
        maxTemp = max(maxTemp, pixels[pixelIndex]);
        minTemp = min(minTemp, pixels[pixelIndex]);
        sum += pixels[pixelIndex];
      }
    }

    float averageTemp = sum / AMG88xx_PIXEL_ARRAY_SIZE;
    float environmentTemp = amg.readThermistor(); // Read ambient temperature

    // Create JSON document
    doc.clear();
    JsonArray jsonGrid = doc.createNestedArray("grid");

    // Add each row to the grid array
    for (int i = 0; i < 8; i++)
    {
      JsonArray row = jsonGrid.createNestedArray();
      for (int j = 0; j < 8; j++)
      {
        row.add(grid[i][j]);
      }
    }

    // Add additional thermal data
    doc["maxTemp"] = maxTemp;
    doc["minTemp"] = minTemp;
    doc["averageTemp"] = averageTemp;
    doc["environmentTemp"] = environmentTemp;
    doc["timestamp"] = millis();
    doc["sensorStatus"] = "ok";

    // Serialize JSON to string
    serializeJson(doc, jsonBuffer);

    // Broadcast to all connected clients
    webSocket.broadcastTXT(jsonBuffer);

    // Update last reading time
    lastReadingTime = millis();

    // Toggle LED to show activity
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
  }
  else if (!sensorInitialized)
  {
    // If sensor failed to initialize, send error status
    doc.clear();
    doc["error"] = "Sensor not initialized";
    doc["sensorStatus"] = "error";
    serializeJson(doc, jsonBuffer);
    webSocket.broadcastTXT(jsonBuffer);

    // Blink LED to indicate error
    digitalWrite(LED_PIN, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
    delay(100);
  }
}

void webSocketEvent(uint8_t num, WStype_t type, uint8_t *payload, size_t length)
{
  switch (type)
  {
  case WStype_DISCONNECTED:
    Serial.printf("[%u] Disconnected!\n", num);
    break;
  case WStype_CONNECTED:
  {
    IPAddress ip = webSocket.remoteIP(num);
    Serial.printf("[%u] Connected from %d.%d.%d.%d\n", num, ip[0], ip[1], ip[2], ip[3]);

    // Send initial status
    doc.clear();
    doc["sensorStatus"] = sensorInitialized ? "ok" : "error";
    doc["wifiStatus"] = wifiInitialized ? "ok" : "error";
    serializeJson(doc, jsonBuffer);
    webSocket.sendTXT(num, jsonBuffer);
  }
  break;
  case WStype_TEXT:
    // Handle incoming messages if needed
    break;
  case WStype_BIN:
    // Handle binary messages if needed
    break;
  case WStype_ERROR:
    Serial.printf("[%u] Error!\n", num);
    break;
  }
}