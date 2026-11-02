@REM Maven Wrapper startup batch script
@echo off
setlocal

set DIRNAME=%~dp0
if "%DIRNAME%" == "" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

set WRAPPER_JAR="%APP_HOME%\.mvn\wrapper\maven-wrapper.jar"
set WRAPPER_CONF="%APP_HOME%\.mvn\wrapper\maven-wrapper.properties"

java -classpath %WRAPPER_JAR% org.apache.maven.wrapper.MavenWrapperMain %*
