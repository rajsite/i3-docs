@echo off
echo Current directory: %cd%
if [%1] == [] (
  set LV_GENERATE_VI="..\lv\Main\Autorun Generate JSON Request.vi"
) else (
  set LV_GENERATE_VI=%1
)
echo Path to autogenerate VI: %LV_GENERATE_VI%
echo Attempting to launch LabVIEW and generate output
start /wait cmd /c %LV_GENERATE_VI%
echo Finished launch LabVIEW and generate output
