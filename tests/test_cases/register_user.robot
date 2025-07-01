*** Settings ***
Library    SeleniumLibrary
Library    Collections
Library    Process
Library    OperatingSystem
Resource    ../resources/variables.robot

*** Test Cases ***
Navigate To Homepage And Register New User
    Log    Starting test case: Navigate To Homepage And Register New User

    # Generate a random string for a unique directory
    ${RANDOM_STRING}=    Generate Random String    10
    Log    Generated random string: ${RANDOM_STRING}
    Set Test Variable    ${RANDOM_STRING}

    # Create a directory for the user data
    ${DIRECTORY}=    Set Variable    /tmp/chrome-user-data-${RANDOM_STRING}
    Create Directory    ${DIRECTORY}
    Log    Created directory: ${DIRECTORY}

    # Configure Chrome options
    ${CHROME_OPTIONS}=    Set Chrome Options    ${RANDOM_STRING}
    Log    Chrome options set

    # Open the browser with the specified options
    Open Browser    ${HOMEPAGE_URL}    chrome    options=${CHROME_OPTIONS}
    Log    Browser opened with user-data-dir: ${DIRECTORY}

    # Test steps
    Click Link    Rekisteröidy
    Log    Clicked on 'Rekisteröidy' link
    Input Text    id=Username    ${USERNAME}
    Input Text    id=Password    ${PASSWORD}
    Click Button    id=Register
    Page Should Contain    Registration successful

    [Teardown]    Custom Teardown    ${RANDOM_STRING}
    Log    Test case completed

*** Keywords ***
Generate Random String
    [Arguments]    ${length}
    ${random_string}=    Evaluate    ''.join(random.choices(string.ascii_letters + string.digits, k=int(${length})))    random, string
    Log    Generated random string: ${random_string}
    RETURN    ${random_string}

Set Chrome Options
    [Arguments]    ${random_string}
    Log    Setting Chrome options with random string: ${random_string}
    ${chrome_options}=    Evaluate    selenium.webdriver.ChromeOptions()    selenium.webdriver
    Call Method    ${chrome_options}    add_argument    --no-sandbox
    Call Method    ${chrome_options}    add_argument    --disable-dev-shm-usage
    ${arg}=    Set Variable    --user-data-dir=/tmp/chrome-user-data-${random_string}
    Call Method    ${chrome_options}    add_argument    ${arg}
    RETURN    ${chrome_options}

Create Directory
    [Arguments]    ${directory}
    Log    Creating directory: ${directory}
    Run Process    mkdir    -p    ${directory}
    Log    Directory created successfully

Custom Teardown
    [Arguments]    ${random_string}
    Log    Running custom teardown for random string: ${random_string}
    Close Browser
    Log    Browser closed
    Remove Directory    /tmp/chrome-user-data-${random_string}
    Log    Directory removed: /tmp/chrome-user-data-${random_string}

Remove Directory
    [Arguments]    ${directory}
    Log    Removing directory: ${directory}
    Run Process    rm    -rf    ${directory}
    Log    Directory removed successfully
