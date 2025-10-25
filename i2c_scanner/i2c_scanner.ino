/*
 * I2C Scanner for ESP32
 * This sketch scans the I2C bus for devices and reports their addresses
 * Useful for verifying connections with I2C devices like the AMG8833
 * 
 * Connections:
 * ESP32 SDA -> GPIO21
 * ESP32 SCL -> GPIO22
 */

#include <Wire.h>

// Debug LED pin (built-in LED on most ESP32 boards)
const int LED_PIN = 2;

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  
  // Initialize LED
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);
  
  // Initialize I2C
  Wire.begin(21, 22); // SDA=21, SCL=22
  Wire.setClock(100000); // Set to 100kHz for better stability
  
  // Wait a moment for serial to be ready
  delay(1000);
  
  Serial.println("\nI2C Scanner");
  Serial.println("Scanning for I2C devices...");
}

void loop() {
  byte error, address;
  int nDevices = 0;
  
  // Blink LED to show we're scanning
  digitalWrite(LED_PIN, HIGH);
  
  Serial.println("\nScanning...");
  
  // Scan through all possible I2C addresses
  for(address = 1; address < 127; address++) {
    Wire.beginTransmission(address);
    error = Wire.endTransmission();
    
    if (error == 0) {
      // Device found
      Serial.print("I2C device found at address 0x");
      if (address < 16) {
        Serial.print("0");
      }
      Serial.print(address, HEX);
      
      // Special note for AMG8833 which uses address 0x69
      if (address == 0x69) {
        Serial.print(" (Likely AMG8833 Thermal Camera)");
      }
      Serial.println();
      
      nDevices++;
    }
    else if (error == 4) {
      // Error during transmission
      Serial.print("Unknown error at address 0x");
      if (address < 16) {
        Serial.print("0");
      }
      Serial.println(address, HEX);
    }
  }
  
  if (nDevices == 0) {
    Serial.println("No I2C devices found\n");
    Serial.println("Check your connections and try:");
    Serial.println("1. Verify power (3.3V) and ground connections");
    Serial.println("2. Make sure SDA is connected to GPIO21");
    Serial.println("3. Make sure SCL is connected to GPIO22");
    Serial.println("4. Try adding 4.7k pullup resistors on SDA and SCL");
  } else {
    Serial.println("Scan complete\n");
  }
  
  // Turn off LED
  digitalWrite(LED_PIN, LOW);
  
  // Wait 5 seconds before next scan
  delay(5000);
} 