*** Settings ***
Library    SeleniumLibrary
Library    Collections
Library    Process
Library    OperatingSystem
Resource    ../resources/variables.robot

*** Variables ***
${HOMEPAGE_URL}    http://frontend:80
${BROWSER}         chrome
${USERNAME}         testuser2
${PASSWORD}         testpw2

*** Test Cases ***
Navigate To Homepage And Register New User
    Log    Starting test case: Navigate To Homepage And Register New User

    # Generate a unique user data directory for this test run
    ${random_string}=    Generate Random String    10
    ${CHROME_DATA_DIR}=    Set Variable    /tmp/chrome-data-dir-${random_string}
    Log    Using Chrome data directory: ${CHROME_DATA_DIR}

    # Cleanup any existing Chrome processes
    Run Process    pkill    -f    chrome
    Log    Cleaned up existing Chrome processes

    # Wait a bit to ensure all processes are terminated
    Sleep    5s

    # Create the Chrome data directory
    Run Process    mkdir    -p    ${CHROME_DATA_DIR}
    Log    Created Chrome data directory: ${CHROME_DATA_DIR}

    # Set up Chrome options with a unique user data directory
    ${CHROME_OPTIONS}=    Set Chrome Options    ${CHROME_DATA_DIR}
    Log    Chrome options set with unique user data directory

    # Open browser with the custom options
    Create WebDriver    Chrome    options=${CHROME_OPTIONS}
    Go To    ${HOMEPAGE_URL}
    Log    Browser opened successfully

    
    Click Link    Rekisteröidy
    Log    Clicked on 'Rekisteröidy' link
    Input Text    id=Username    ${USERNAME}
    Input Text    id=Password    ${PASSWORD}
    Click Button    id=Register
    Page Should Contain    Registration successful
    [Teardown]    Custom Teardown    ${CHROME_DATA_DIR}
    Log    Test case completed

*** Keywords ***
Generate Random String
    [Arguments]    ${length}
    ${random_string}=    Evaluate    ''.join(random.choices(string.ascii_letters + string.digits, k=int(${length})))    random, string
    RETURN    ${random_string}

Set Chrome Options
    [Arguments]    ${user_data_dir}
    ${options}=    Evaluate    sys.modules['selenium.webdriver'].ChromeOptions()    sys
    
    Call Method    ${options}    add_argument    --no-sandbox
    Call Method    ${options}    add_argument    --disable-dev-shm-usage
    Call Method    ${options}    add_argument    --headless
    Call Method    ${options}    add_argument    --disable-gpu

    ${user_data_arg}=    Set Variable    --user-data-dir=${user_data_dir}
    Call Method    ${options}    add_argument    ${user_data_arg}

    RETURN    ${options}


Custom Teardown
    [Arguments]    ${user_data_dir}
    Close Browser
    Log    Browser closed
    # Cleanup - remove the user data directory
    Remove Directory    ${user_data_dir}
    # Kill any remaining Chrome processes
    Run Process    pkill    -f    chrome
    Log    Killed any remaining Chrome processes
    Sleep    5s

Remove Directory
    [Arguments]    ${directory}
    Log    Removing directory: ${directory}
    Run Process    rm    -rf    ${directory}
    Log    Directory removed successfully
