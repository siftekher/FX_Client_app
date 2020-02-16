import React from 'react';
import {StyleSheet, Dimensions, ScrollView, Image, ImageBackground, Platform, Picker, View} from 'react-native';
import { Block, Text, theme, Input, Button } from 'galio-framework';
import { LinearGradient } from 'expo-linear-gradient';

import { Icon } from '../components';
import { Images, materialTheme } from '../constants';
import { HeaderHeight } from "../constants/utils";
//import { Dropdown } from 'react-native-material-dropdown';
const { width } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;
import { API } from "aws-amplify";

export default class UserProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      aws_cognito_id: "",
	  id: "",
      email: "",
      title: "",
      first_name: "",
      first_nameState: "",
      middle_name: "",
      middle_nameState: "",
      last_name: "",
      last_nameState: "",
      change_password_dialog: false,
      old_password: "",
      new_password: "",
      new_password_confirm: "",
      new_password_state: "",
      new_password_confirm_state: "",
      new_password_changing: false,
      change_email_dialog: false,

      language_id_list: [],
      country_list: [],
      client_todo_list: [],

      language_id: "",
      current_client_id: "",
      countries_list_options: "",
      country_value: ""
    };
  }

  async componentDidMount() {
      try {
        const user = await this.getUserProfile();

        const {
          id,
		  aws_cognito_id,
          email,
          title,
          first_name,
          middle_name,
          last_name,
          external_reference,
          residential_street_line_1,
          residential_street_line_2,
          residential_street_suburb,
          residential_street_state,
          residential_street_postcode,
          residential_street_country,
          telephone_home,
          telephone_mobile,
          telephone_work,
          email_secondary,
          language_id,
          account_status_notes
        } = user;
		

        this.setState({
		  id,	
          aws_cognito_id,
          email,
          title,
          first_name,
          middle_name,
          last_name,
          external_reference,
          residential_street_line_1,
          residential_street_line_2,
          residential_street_suburb,
          residential_street_state,
          residential_street_postcode,
          residential_street_country,
          telephone_home,
          telephone_mobile,
          telephone_work,
          email_secondary,
          language_id,
          account_status_notes
        });
      } catch (e) {
        console.error(e);
      }
	  
    //}
    API.get("countries", `/countries/get-all`)
        .then(response => {
          //console.log(response);

          const countries_list_options = response
              .map(item => ({
                label: item.full_name, value: item.full_name
              }));
          this.setState({ countries_list_options: countries_list_options });
          this.setState({
            country_list: response
          });
        })
        .catch(error => {
          console.log(error);
        });
  }


  async getUserProfile() { //aws_cognito_id
    return API.get("clients", `/get/for_mob`);
  }
  
  verifyLength = (value, length) => {
    if (value.length >= length) {
      return true;
    }
    return false;
  };
  // function that verifies if value contains only numbers
  verifyNumber = value => {
    var numberRex = new RegExp("^[0-9]+$");
    if (numberRex.test(value)) {
      return true;
    }
    return false;
  };
  change = (event, stateName, type, stateNameEqualTo, maxValue) => {
    //console.log(event.nativeEvent.text);
	  
    switch (type) {
      case "email":
        if (this.verifyEmail(event.nativeEvent.text)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      case "length":
        if (this.verifyLength(event.nativeEvent.text, stateNameEqualTo)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }

        break;
      case "number":
        if (this.verifyNumber(event.nativeEvent.text, stateNameEqualTo)) {
          this.setState({ [stateName + "State"]: "has-success" });
        } else {
          this.setState({ [stateName + "State"]: "has-danger" });
        }
        break;
      default:
        break;
    }
    this.setState({ [stateName]: event.nativeEvent.text });
	
  };

   updateUserProfile(user) {
    return API.put("clients", "/update/id/"+this.state.id, {
      body: user
    });
  }
  
   updateClient = () => {
    const {
      first_name,
      last_name,
	  residential_street_country,
	  residential_street_state,
	  residential_street_line_1,
	  residential_street_suburb,
	  residential_street_postcode,
	  telephone_home
    } = this.state;
	
    try {
       this.updateUserProfile({
        first_name: first_name,
        last_name: last_name,
		residential_street_country: residential_street_country,
		residential_street_state: residential_street_state,
		residential_street_line_1: residential_street_line_1,
		residential_street_suburb: residential_street_suburb,
		residential_street_postcode: residential_street_postcode,
		telephone_home: telephone_home
		
		
		
      });
    } catch (e) {
      alert(e);
    }
  }

  render() {

    let country_option = this.state.country_list.map( (item, i) => {
      return <Picker.Item key={i} value={item.id} label={item.full_name} />
    });

    return (
      <Block flex style={styles.profile}>
        <Block flex={0.92}>
          <Block style={styles.options}>
            <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
              <Block row space="between" style={{ padding: theme.SIZES.BASE, }}>
                <Block middle>
				  <Text bold>Profile Information</Text>
                </Block>
              </Block>

              <Block>
                <Input placeholder="First Name" value= {this.state.first_name} onChange={e => this.change(e, "first_name", "length", 1)}/>
                <Input placeholder="Last Name" value= {this.state.last_name} onChange={e => this.change(e, "last_name", "length", 1)}/>
				<Text>Email: {this.state.email}</Text>
				
				{/*<Input placeholder="Country" value= {this.state.residential_street_country} onChange={e => this.change(e, "residential_street_country", "length", 1)}/>*/}
               
				<Input placeholder="State" value= {this.state.residential_street_state} onChange={e => this.change(e, "residential_street_state", "length", 1)}/>
				<Input placeholder="Address" value= {this.state.residential_street_line_1} onChange={e => this.change(e, "residential_street_line_1", "length", 1)}/>
				<Input placeholder="Suburb" value= {this.state.residential_street_suburb} onChange={e => this.change(e, "residential_street_suburb", "length", 1)}/>
				<Input placeholder="Postcode" value= {this.state.residential_street_postcode} onChange={e => this.change(e, "residential_street_postcode", "length", 1)}/>
				<Input placeholder="Phone"  value= {this.state.telephone_home} onChange={e => this.change(e, "telephone_home", "length", 1)}/>
              </Block>
              <Block>
                <Text>Country</Text>
                <View style={{borderRadius: 5, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', width: 295}}>
                  <Picker
                      style={ {width: 295, height: 40}}
                      selectedValue={this.state.ben_address_country}
                      onValueChange={ (service) => ( this.setState({ben_address_country:service}) ) } >
                      {country_option}
                  </Picker>
                </View>
              </Block>
            </ScrollView>
			
			  <Block>
                 <View style={{ marginRight: 10, width: 300, height: 40 }}>
			       <Button style={{ marginRight: 10, width: 300, height: 40 }} onPress={this.updateClient}>Update</Button>
                 </View>
			  </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
  },
  profileImage: {
    width: width * 1.1,
    height: 'auto',
  },
  profileContainer: {
    width: width,
    height: 'auto',
    flex: 1,
  },
  profileDetails: {
    paddingTop: theme.SIZES.BASE * 4,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  profileTexts: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
    zIndex: 2
  },
  pro: {
    backgroundColor: materialTheme.COLORS.LABEL,
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    borderRadius: 4,
    height: 19,
    width: 38,
  },
  seller: {
    marginRight: theme.SIZES.BASE / 2,
  },
  options: {
    position: 'relative',
    paddingHorizontal: theme.SIZES.BASE,
    paddingVertical: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: -theme.SIZES.BASE,
    marginBottom: 0,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    position: 'absolute',
  },
});
