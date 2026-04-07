package com.huellitascallejeras.utils;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class WaitUtils {

    private final WebDriver driver;
    private final int timeout;

    public WaitUtils(WebDriver driver) {
        this(driver, 10);
    }

    public WaitUtils(WebDriver driver, int timeout) {
        this.driver  = driver;
        this.timeout = timeout;
    }

    public WebElement untilVisible(By locator) {
        return new WebDriverWait(driver, Duration.ofSeconds(timeout))
                .until(ExpectedConditions.visibilityOfElementLocated(locator));
    }

    public WebElement untilClickable(By locator) {
        return new WebDriverWait(driver, Duration.ofSeconds(timeout))
                .until(ExpectedConditions.elementToBeClickable(locator));
    }

    public boolean untilInvisible(By locator) {
        return new WebDriverWait(driver, Duration.ofSeconds(timeout))
                .until(ExpectedConditions.invisibilityOfElementLocated(locator));
    }

    public boolean untilTextPresent(By locator, String text) {
        return new WebDriverWait(driver, Duration.ofSeconds(timeout))
                .until(ExpectedConditions.textToBePresentInElementLocated(locator, text));
    }

    public boolean untilUrlContains(String fragment) {
        return new WebDriverWait(driver, Duration.ofSeconds(timeout))
                .until(ExpectedConditions.urlContains(fragment));
    }
}
