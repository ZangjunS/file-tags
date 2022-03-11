@echo off
CHCP 65001>nul
cscript -nologo -e:jscript  %~dp0\getfile.js 1
@REM cscript -nologo    %~dp0\getfile.vbs 1