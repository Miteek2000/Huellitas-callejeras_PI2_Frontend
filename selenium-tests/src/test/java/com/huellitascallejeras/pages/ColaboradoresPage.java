package com.huellitascallejeras.pages;

import com.huellitascallejeras.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.Select;

import java.util.List;

public class ColaboradoresPage {

    private static final String URL_PATH = "/colaboradores";

    private final By tableRows     = By.cssSelector("[data-testid='colaboradores-table'] tbody tr");
    private final By newButton     = By.cssSelector("[data-testid='nuevo-colaborador-btn']");
    private final By modal         = By.cssSelector("[data-testid='colaborador-modal']");
    private final By nombreInput   = By.name("nombre");
    private final By emailInput    = By.name("email");
    private final By rolSelect     = By.name("rol");
    private final By saveButton    = By.cssSelector("[data-testid='guardar-colaborador-btn']");
    private final By confirmModal  = By.cssSelector("[data-testid='confirm-modal']");
    private final By confirmButton = By.cssSelector("[data-testid='confirm-btn']");
    private final By successToast  = By.cssSelector("[data-testid='success-toast']");

    private final WebDriver driver;
    private final WaitUtils wait;

    public ColaboradoresPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WaitUtils(driver);
    }

    public void open(String baseUrl) {
        driver.get(baseUrl + URL_PATH);
    }

    public List<WebElement> getRows() {
        return driver.findElements(tableRows);
    }

    public void clickNew() {
        wait.untilClickable(newButton).click();
    }

    public void fillForm(String nombre, String email, String rol) {
        wait.untilVisible(modal);

        var nombreField = wait.untilVisible(nombreInput);
        nombreField.clear();
        nombreField.sendKeys(nombre);

        var emailField = wait.untilVisible(emailInput);
        emailField.clear();
        emailField.sendKeys(email);

        new Select(wait.untilVisible(rolSelect)).selectByVisibleText(rol);
    }

    public void save() {
        wait.untilClickable(saveButton).click();
    }

    public void confirmAction() {
        wait.untilVisible(confirmModal);
        wait.untilClickable(confirmButton).click();
    }

    public String getSuccessToast() {
        return wait.untilVisible(successToast).getText();
    }
}
