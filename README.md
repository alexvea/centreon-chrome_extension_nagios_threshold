# chrome_extension_nagios_threshold
## Description :
 Chrome extension that allows you to test "nagios" type thresholds and get a preview of what metric should look like in the perfdata from a plugin output.

## How to use install/use this chrome extension : 

1) Download the folder of this git repo and unzip it.
2) Open your Chrome web browser and put chrome://extensions/ in url bar.
3) Click on "load unpacked" (in fr "Charger l'extension non empaquetée").
4) Select the folder.
5) Pin the extension called "nagios" threshold :

![image](https://github.com/alexvea/chrome_extension_nagios_threshold/assets/35368807/da7104ec-25a2-4680-951c-d559ab16a132)

6)Finally, use it by clicking on the Centreon icon : 

![image](https://github.com/alexvea/chrome_extension_nagios_threshold/assets/35368807/2609d761-af27-460f-bc4d-0872d6a21edc)

7)It should appear like this : 

![image](https://github.com/alexvea/chrome_extension_nagios_threshold/assets/35368807/d028b797-b71a-4d10-bc03-902dd0f6d5b9)

8)add value to warning/critical threshold, value and click on "Test" : 

![image](https://github.com/alexvea/chrome_extension_nagios_threshold/assets/35368807/74522458-a0b0-4b69-941d-d18732acea70)


## Functionnalities :

- Can add explanation of the current status and metric :

  ![image](https://github.com/alexvea/chrome_extension_nagios_threshold/assets/35368807/26b90352-320e-4296-9561-059a1030bf70)

- Random value generated according to warning or critical values.
- Same rules as : https://nagios-plugins.org/doc/guidelines.html#THRESHOLDFORMAT
  ![image](https://github.com/alexvea/chrome_extension_nagios_threshold/assets/35368807/7672dbc8-1c70-4c58-9c96-5e661f36d4e7)

- Decimals and negatives numbers.

  ## Not yet functionning :

  - First 3 rules are not yet implemented :
 
  ![image](https://github.com/alexvea/chrome_extension_nagios_threshold/assets/35368807/ce7d88f8-dde1-4437-9ac3-fcf8ad024767)


