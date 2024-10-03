let serial;
let temperature;
let windSpeed;
let ledIndex = 0;
const totalLeds = 120;
const portName = '/dev/cu.usbmodem14201'; // Update with your Arduino's port

function setup() {
    createCanvas(400, 400);
    serial = new p5.SerialPort();
    serial.open(portName);
    getWeatherData();
    setInterval(getWeatherData, 60000); // Update every minute
}

function draw() {
    background(0);
    if (temperature !== undefined && windSpeed !== undefined) {
        // Calculate color based on temperature
        let colorValue = map(temperature, -30, 50, 0, 255); // Assuming a range of -30 to 50 degrees
        let r = constrain(colorValue, 0, 255);
        let b = 255 - constrain(colorValue, 0, 255);

        // Send LED index and color to Arduino
        let ledColor = [ledIndex, r, 0, b]; // [index, red, green, blue]
        serial.write(ledColor);

        // Update the LED index
        ledIndex = (ledIndex + 1) % totalLeds;
        let delayTime = map(windSpeed, 0, 30, 200, 50); // Speed based on wind speed
        delay(delayTime);
    }
}

function getWeatherData() {
    const apiKey = 'f2fd1c15559413b8e3b375df8a509244d'; // Replace with your OpenWeatherMap API key
    const city = 'London'; // Replace with your desired city
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    
    fetch(url)
        .then(response => response.json())
        .then(data => {
            temperature = data.main.temp; // Temperature in Celsius
            windSpeed = data.wind.speed; // Wind speed in m/s
            console.log(`Temperature: ${temperature}, Wind Speed: ${windSpeed}`);
        })
        .catch(error => console.error('Error fetching weather data:', error));
}