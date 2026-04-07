package com.huellitascallejeras.pages;

import com.huellitascallejeras.utils.WaitUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;

/**
 * Page Object para el flujo de registro de dos pasos:
 *   Paso 1 — Formulario de datos del usuario.
 *   Paso 2 — Modal de aceptación de términos y condiciones.
 */
public class RegisterPage {

    private static final String URL_PATH = "/auth/registro";

    // ── Paso 1: formulario de registro ──────────────────────────────
    private final By nombreInput        = By.name("nombre");
    private final By emailInput         = By.id("email");
    private final By passwordInput      = By.id("password");
    private final By confirmPassInput   = By.id("confirmPassword");
    private final By submitButton       = By.cssSelector("button[type='submit']");
    private final By errorMessage       = By.cssSelector("[data-testid='error-message']");

    // ── Paso 2: modal de términos ────────────────────────────────────
    private final By termsModal         = By.cssSelector("[data-testid='terms-modal']");
    private final By acceptTermsButton  = By.cssSelector("[data-testid='accept-terms-btn']");
    private final By declineTermsButton = By.cssSelector("[data-testid='decline-terms-btn']");
    private final By successMessage     = By.cssSelector("[data-testid='success-message']");

    private final WebDriver driver;
    private final WaitUtils wait;

    public RegisterPage(WebDriver driver) {
        this.driver = driver;
        this.wait   = new WaitUtils(driver);
    }

    // ── Navegación ──────────────────────────────────────────────────

    public void open(String baseUrl) {
        driver.get(baseUrl + URL_PATH);
    }

    // ── Paso 1 ───────────────────────────────────────────────────────

    public void fillNombre(String nombre) {
        var field = wait.untilVisible(nombreInput);
        field.clear();
        field.sendKeys(nombre);
    }

    public void fillEmail(String email) {
        var field = wait.untilVisible(emailInput);
        field.clear();
        field.sendKeys(email);
    }

    public void fillPassword(String password) {
        var field = wait.untilVisible(passwordInput);
        field.clear();
        field.sendKeys(password);
    }

    public void fillConfirmPassword(String password) {
        var field = wait.untilVisible(confirmPassInput);
        field.clear();
        field.sendKeys(password);
    }

    /** Rellena todos los campos del formulario de una vez. */
    public void fillForm(String nombre, String email, String password) {
        fillNombre(nombre);
        fillEmail(email);
        fillPassword(password);
        fillConfirmPassword(password);
    }

    public void clickSubmit() {
        wait.untilClickable(submitButton).click();
    }

    public String getErrorMessage() {
        return wait.untilVisible(errorMessage).getText();
    }

    // ── Paso 2: modal de términos ────────────────────────────────────

    public void waitForTermsModal() {
        wait.untilVisible(termsModal);
    }

    public boolean isTermsModalVisible() {
        return !driver.findElements(termsModal).isEmpty()
                && driver.findElement(termsModal).isDisplayed();
    }

    public void acceptTerms() {
        wait.untilVisible(termsModal);
        wait.untilClickable(acceptTermsButton).click();
    }

    public void declineTerms() {
        wait.untilVisible(termsModal);
        wait.untilClickable(declineTermsButton).click();
    }

    public String getSuccessMessage() {
        return wait.untilVisible(successMessage).getText();
    }

    // ── Flujo completo ───────────────────────────────────────────────

    /** Completa el registro end-to-end: formulario → modal → aceptar. */
    public void registerAndAcceptTerms(String nombre, String email, String password) {
        fillForm(nombre, email, password);
        clickSubmit();
        acceptTerms();
    }
}
