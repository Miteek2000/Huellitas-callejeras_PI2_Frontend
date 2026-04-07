package com.huellitascallejeras.utils;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

import java.io.FileInputStream;
import java.io.IOException;
import java.time.Duration;
import java.util.Properties;

public class DriverManager {

    private static WebDriver driver;
    private static final String CONFIG_PATH = "resources/config.properties";

    public static WebDriver getDriver() {
        if (driver == null) {
            Properties config = loadConfig();

            String browser = System.getenv("BROWSER") != null
                    ? System.getenv("BROWSER")
                    : config.getProperty("browser.name", "chrome");

            boolean headless = Boolean.parseBoolean(
                    System.getenv("HEADLESS") != null
                            ? System.getenv("HEADLESS")
                            : config.getProperty("browser.headless", "false"));

            int implicitWait = Integer.parseInt(
                    config.getProperty("driver.implicit_wait", "10"));

            if (browser.equalsIgnoreCase("firefox")) {
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions options = new FirefoxOptions();
                if (headless) options.addArguments("--headless");
                driver = new FirefoxDriver(options);
            } else {
                WebDriverManager.chromedriver().setup();
                ChromeOptions options = new ChromeOptions();
                if (headless) {
                    options.addArguments("--headless", "--no-sandbox", "--disable-dev-shm-usage");
                }
                driver = new ChromeDriver(options);
            }

            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(implicitWait));
            driver.manage().window().maximize();
        }
        return driver;
    }

    public static void quitDriver() {
        if (driver != null) {
            driver.quit();
            driver = null;
        }
    }

    private static Properties loadConfig() {
        Properties props = new Properties();
        try (FileInputStream fis = new FileInputStream(CONFIG_PATH)) {
            props.load(fis);
        } catch (IOException e) {
            System.err.println("No se pudo cargar config.properties, usando valores por defecto.");
        }
        return props;
    }
}
