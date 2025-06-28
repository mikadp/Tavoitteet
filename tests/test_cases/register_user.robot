*** Settings ***
Library     SeleniumLibrary
Resource    ../resources/variables.robot

*** Variables ***
${CHROME_OPTIONS} add_argument=--no-sandbox add_argument=--disable-dev-shm-usage add_argument=--user-data-dir=/tmp/chrome-user-data-${RANDOM_STRING}

*** Test Cases ***
Navigate To Homepage And Register New User
    ${RANDOM_STRING}= Generate Random String 10
    Create Directory /tmp/chrome-user-data-${RANDOM_STRING}
    Open Browser    ${HOMEPAGE URL}    ${BROWSER} option=${CHROME_OPTIONS}
    Click Link    Rekisteröidy
    Input Text    id=Username    ${USERNAME}
    Input Text    id=Password    ${PASSWORD}
    Click Button    id=Register
    Page Should Contain    Registration successful
    [Teardown]    Close Browser

*** Keywords ***
Generate Random String
    [Arguments] ${length}
    ${random_string}=   Evaluate    ''.join(random.choices(string.ascii_letters + string.digits, k=${length})) Modules=random, string
    [Return] ${random_string}

Create Directory
    [Arguments] ${directory}
    Run Process mkdir -p ${directory}

Remove Directory
    [Arguments] ${directory}
    Run Process rm -rf ${directory}