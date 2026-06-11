import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';



  interface Props {
    onCountryCodeChange:(code:string)=>void
    onChangeText:(t:string)=> void
    value:string
    error:string
  }

  interface Country {
    name: string
    dialCode:string
    flag:any

  }



  const countries:Country[] = [
    // {
    //   name: "United States",
    //   dialCode: "+1",
    //   flag: "🇺🇸"
    // },
    // {
    //   name: "Canada",
    //   dialCode: "+1",
    //   flag: "🇨🇦"
    // },
    // {
    //   name: "United Kingdom",
    //   dialCode: "+44",
    //   flag: "🇬🇧"
    // },
    // {
    //   name: "India",
    //   dialCode: "+91",
    //   flag: "🇮🇳"
    // },
    {
      name: "Uganda",
      dialCode: "+256",
      flag: "🇺🇬"
    },
    // Add more countries as needed
  ];


const PhoneInput = ({
  onCountryCodeChange,
  onChangeText,
  value,
  error
}:Props) => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);

  const handleCountryChange = (country:Country) => {
    setSelectedCountry(country);
    onCountryCodeChange(country.dialCode);
  };

  return (
    <View style={{width:"100%",height:60}}>
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setSelectedCountry(countries[0])}>
        <Text style={styles.countryFlag}>{selectedCountry.flag}</Text>
      </TouchableOpacity>
      {/* code */}
      <Text style={styles.countryCode}>{selectedCountry.dialCode}</Text>
      {/* input */}
      <TextInput
        style={styles.phoneNumberInput}
        value={value}
        onChangeText={(t)=>onChangeText(t)}
        placeholder="Enter phone number"
        keyboardType="phone-pad"

      />
      
    </View>
     {
       error &&  <Text style={{fontSize:12,fontWeight:"400",color:"red",marginVertical:2}}>
       Phone number is required
       </Text>
     }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:50,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    position:"relative"

  },
  countryFlag: {
    fontSize: 20,
    marginRight: 5,
  },
  countryCode: {
    fontSize: 16,
    marginRight: 10,
  },
  phoneNumberInput: {
    flex: 1,
    fontSize: 16,
    height:50
  },
  countryDropdown: {
    position: 'absolute',
    top:55,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    zIndex:10,
  },
  countryDropdownItem: {
    paddingVertical: 10,
  },
  countryDropdownText: {
    fontSize: 14,
  },
});

export default PhoneInput;