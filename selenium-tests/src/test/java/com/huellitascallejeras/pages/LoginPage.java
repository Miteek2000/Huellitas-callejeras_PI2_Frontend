package com.huellitascallejeras.pages;

import com.huellitascallejeras.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

public class LoginPage {

    private static final String URL_PATH = "/auth/login";

    private final By emailInput    = By.id("email");
    private final By passwordInput = By.id("password");
    private final By submitButton  = By.cssSelector("button[type='submit']");
    private final By errorMessage  = By.cssSelector("[data-testid='error-message']");

    private final WebDriver driver;
    private final WaitUtils wait;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WaitUtils(driver);
    }

    public void open(String baseUrl) {
        driver.get(baseUrl + URL_PATH);
    }

    public void enterEmail(String email) {
        var field = wait.untilVisible(emailInput);
        field.clear();
        field.sendKeys(email);
    }

    public void enterPassword(String password) {
        var field = wait.untilVisible(passwordInput);
        field.clear();
        field.sendKeys(password);
    }

    public void clickSubmit() {
        wait.untilClickable(submitButton).click();
    }

    public void login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        clickSubmit();
    }

    public String getErrorMessage() {
        return wait.untilVisible(errorMessage).getText();
    }
}
