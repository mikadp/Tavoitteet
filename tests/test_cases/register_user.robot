*** Settings ***
Library     SeleniumLibrary
Resource    ../resources/variables.robot

*** Test Cases ***
Navigate To Homepage And Register New User
    Open Browser    ${HOMEPAGE URL}    ${BROWSER}    options=--headless --disable-gpu --no-sandbox --disable-dev-shm-usage
    Click Link    Rekisteröidy
    Input Text    id=Username    ${USERNAME}
    Input Text    id=Password    ${PASSWORD}
    Click Button    id=Register
    Page Should Contain    Registration successful
    [Teardown]    Close Browser