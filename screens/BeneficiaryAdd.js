import React from 'react';
import {StyleSheet, Dimensions, ScrollView, Image, Platform, TextInput, Picker, View} from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

const { width } = Dimensions.get('screen');
import womanImages from '../constants/images/woman';
import { API } from "aws-amplify";
import homeImages from "../constants/images/home";
import {HeaderHeight} from "../constants/utils";

import {materialTheme} from "../constants";
import {Icon} from "../components";
const thumbMeasure = (width - 48 - 32) / 3;
import { Select } from '../components/';

export default class BeneficiaryAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bene_id: "",
            currencies_list: [],
            currencies_list_priority: [],
            legal_type: '',
            loaded: false,
            is_loading: true,
            nickname: "",
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            password: "",
            security_entities: [],
            country_list: [],
            country_list_prio: [],
            legal_entity_types_list: [],
            ben_legal_name: "",
            currency_full_name: ""
        };
    }

    componentDidMount() {
        // console.log(this.props);

        API.get("currencies", `/currencies/get-all`)
            .then(response => {
                // console.log(response);
                this.setState({
                    currencies_list: response
                });
            })
            .catch(error => {
                console.log(error);
            });

        API.get("countries", `/countries/get-all`)
            .then(response => {
                // console.log(response)
                this.setState({
                    country_list: response
                });
            })
            .catch(error => {
                console.log(error);
            });
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
                    this.setState({ [stateName + "_state"]: "Success" });
                } else {
                    this.setState({ [stateName + "_state"]: "Error" });
                }
                break;
            case "length":
                if (this.verifyLength(event.nativeEvent.text, stateNameEqualTo)) {
                    this.setState({ [stateName + "_state"]: "Success" });
                } else {
                    this.setState({ [stateName + "_state"]: "Error" });
                }

                break;
            case "number":
                if (this.verifyNumber(event.nativeEvent.text, stateNameEqualTo)) {
                    this.setState({ [stateName + "_state"]: "Success" });
                } else {
                    this.setState({ [stateName + "_state"]: "Error" });
                }
                break;
            default:
                break;
        }
        this.setState({ [stateName]: event.nativeEvent.text });
    };

    changeText = (event, stateName, type, stateNameEqualTo, maxValue) => {
        switch (type) {
            case "email":
                if (this.verifyEmail(event)) {
                    this.setState({ [stateName + "_state"]: "Success" });
                } else {
                    this.setState({ [stateName + "_state"]: "Error" });
                }
                break;
            case "length":
                if (this.verifyLength(event, stateNameEqualTo)) {
                    this.setState({ [stateName + "_state"]: "Success" });
                } else {
                    this.setState({ [stateName + "_state"]: "Error" });
                }

                break;
            case "number":
                if (this.verifyNumber(event, stateNameEqualTo)) {
                    this.setState({ [stateName + "_state"]: "Success" });
                } else {
                    this.setState({ [stateName + "_state"]: "Error" });
                }
                break;
            default:
                break;
        }
        this.setState({ [stateName]: event });
    };

    saveBeneficiaryDetail(beneficiary_detail) {
        const {navigation} = this.props;
        //this.props.navigation.navigate('Woman', {token: "reload"});
        API.post(
            "beneficiaries",
            `/beneficiaries/create/in-database`,
            {
                body: beneficiary_detail
            }
        ).then(function(data) {
            navigation.navigate('Woman', {token: "reload"});
        }).catch(err => console.log(err));
    }

    isValidate() {
        let return_flag = true;
        //Validation goes here
        if(this.state.currency_full_name == "") {
            this.setState({ currency_full_name_state: "Error" });
            return_flag = false;
        } else {
            this.setState({ currency_full_name_state: "Success" });
        }
        if(this.state.ben_legal_name == "") {
            this.setState({ ben_legal_name_state: "Error" });
            return_flag = false;
        } else {
            this.setState({ ben_legal_name_state: "Success" });
        }
        if(this.state.nickname == "") {
            this.setState({ nickname_state: "Error" });
            return_flag = false;
        } else {
            this.setState({ nickname_state: "Success" });
        }

        return return_flag;
    }

    saveBeneficiary = () => {

        if(this.isValidate()) {
            const {
                nickname,
                ben_legal_name,
                currency_full_name,
                ben_address_line_1,
                ben_address_line_2,
                ben_address_suburb,
                ben_address_state,
                ben_address_postcode,
                ben_address_country,
                ben_email_main
            } = this.state;

            try {
                this.saveBeneficiaryDetail({
                    nickname: nickname,
                    ben_legal_name: ben_legal_name,
                    account_currency: currency_full_name,
                    ben_address_line_1: ben_address_line_1,
                    ben_address_line_2: ben_address_line_2,
                    ben_address_suburb: ben_address_suburb,
                    ben_address_state: ben_address_state,
                    ben_address_postcode: ben_address_postcode,
                    ben_address_country: ben_address_country,

                    bank_legal_name: "",
                    bank_address_line_1: "",
                    bank_address_line_2: "",
                    bank_address_suburb: "",
                    bank_address_state: "",
                    bank_address_postcode: "",
                    bank_address_country: "",
                    swift_code: "",
                    account_number: "",
                    aba_routing_number: "",
                    bsb_code: "",
                    sort_code: "",

                    ben_telephone_work: "",
                    ben_telephone_afterhours: "",
                    ben_telephone_mobile: "",
                    ben_email_main: ben_email_main,
                    ben_email_secondary: "",
                });
                //this.props.navigation.navigate('Woman', {token: "reload"});
            } catch (e) {
                //alert(e);
            }
        }
    };
    handleCustomReactSelectChange = name => value => {
        this.setState({ [name]: value });
        this.setState({ [name+ "_state"]: "Success" });
    }



    render() {
        const {navigation} = this.props;
        let choose_currency = <Picker.Item key={0} value={""}  label="Select Currency" />;
        let currency_option = this.state.currencies_list.map( (item, i) => {
            return <Picker.Item key={i} value={item.id} label={item.iso_alpha_3} />
        });
        let choose_country = <Picker.Item key={0} value={""}  label="Select Currency" />;
        let country_option = this.state.country_list.map( (item, i) => {
            return <Picker.Item key={i} value={item.id} label={item.full_name} />
        });
        return (
            <Block flex style={styles.profile}>
                <Block flex={0.92}>
                    <Block style={styles.options}>
                        <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
                            <Block>
                                <Text>Account Currency</Text>
                                <View style={this.state.currency_full_name_state == "Error" ? {borderRadius: 10, borderWidth: 1, borderColor: 'red', overflow: 'hidden', width: 295} : {borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', width: 295}}>
                                    <Picker
                                        style={{width:295, height: 40}}
                                        selectedValue={this.state.currency_full_name}
                                        // onValueChange={ (service) => ( this.setState({currency_full_name:service}) ) } >
                                        onValueChange={this.handleCustomReactSelectChange("currency_full_name")} >
                                        {choose_currency}
                                        {currency_option}
                                    </Picker>
                                </View>
                            </Block>
                            <Block>
                                <Text>Account Name</Text>
                                <TextInput
                                    style={ this.state.ben_legal_name_state == "Error" ? {borderColor: 'red', borderWidth: 1, borderRadius: 5, height: 40, paddingLeft:10} : {paddingLeft:10, borderColor: 'grey', borderWidth: 1, borderRadius: 5, height: 40}}
                                    onChangeText={e => this.changeText(e, "ben_legal_name", "length", 1)}
                                    placeholder="Name"
                                    value={this.state.ben_legal_name || ""}
                                />
                            </Block>
                            <Block>
                                <Text>Nickname</Text>
                                <Input
                                    style={ this.state.nickname_state == "Error" ? {borderColor: 'red', borderWidth: 1, borderRadius: 5, height: 40, paddingLeft:10} : {paddingLeft:10, borderColor: 'grey', borderWidth: 1, borderRadius: 5, height: 40}}
                                    key={`ben-nickname-add`} placeholder="nickname" value= {this.state.nickname || ""} onChange={e => this.change(e, "nickname", "length", 1)}/>
                            </Block>
                            <Block>
                                <Text>Email</Text>
                                <Input
                                    style={ {paddingLeft:10, borderColor: 'grey', borderWidth: 1, borderRadius: 5, height: 40}}
                                    key={`ben-nickname-add`} placeholder="Email" value= {this.state.ben_email_main || ""} onChange={e => this.change(e, "ben_email_main", "length", 1)}/>
                            </Block>
                            <Block>
                                <Text>Address</Text>
                                <Input
                                    style={ {paddingLeft:10, borderColor: 'grey', borderWidth: 1, borderRadius: 5, height: 40}}
                                    key={`ben-nickname-add`} placeholder="Address " value= {this.state.ben_address_line_1 || ""} onChange={e => this.change(e, "ben_address_line_1", "length", 1)}/>
                            </Block>


                            <Block>
                                <Text>Address 2</Text>
                                <Input
                                    style={ {paddingLeft:10, borderColor: 'grey', borderWidth: 1, borderRadius: 5, height: 40}}
                                    key={`ben-nickname-add`} placeholder="Address 2" value= {this.state.ben_address_line_2 || ""} onChange={e => this.change(e, "ben_address_line_2", "length", 1)}/>
                            </Block>

                            <Block>
                                <Text>Suburb</Text>
                                <Input
                                    style={ {paddingLeft:10, borderColor: 'grey', borderWidth: 1, borderRadius: 5, height: 40}}
                                    key={`ben-nickname-add`} placeholder="Suburb" value= {this.state.ben_address_suburb || ""} onChange={e => this.change(e, "ben_address_suburb", "length", 1)}/>
                            </Block>

                            <Block>
                                <Text>State</Text>
                                <Input
                                    style={ {paddingLeft:10, borderColor: 'grey', borderWidth: 1, borderRadius: 5, height: 40}}
                                    key={`ben-nickname-add`} placeholder="State" value= {this.state.ben_address_state || ""} onChange={e => this.change(e, "ben_address_state", "length", 1)}/>
                            </Block>

                            <Block>
                                <Text>Postcode</Text>
                                <Input
                                    style={ {paddingLeft:10, borderColor: 'grey', borderWidth: 1, borderRadius: 5, height: 40}}
                                    key={`ben-nickname-add`} placeholder="Postcode" value= {this.state.ben_address_postcode || ""} onChange={e => this.change(e, "ben_address_postcode", "length", 1)}/>
                            </Block>

                            <Block>
                                <Text>Country</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', width: 295, marginBottom:10}}>
                                    <Picker
                                        style={ {width: 295, height: 40}}
                                        selectedValue={this.state.ben_address_country}
                                        onValueChange={ (service) => ( this.setState({ben_address_country:service}) ) } >
                                        {choose_country}
                                        {country_option}
                                    </Picker>
                                </View>
                            </Block>
                        </ScrollView>

                        <Block>
                            <View style={{ marginRight: 10, width: 300, height: 40 }}>
                               <Button style={{ marginRight: 10, width: 300, height: 40 }} onPress={this.saveBeneficiary}>Save</Button>
                            </View>
                        </Block>
                    </Block>
                </Block>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    picker: {
        textDecorationLine: 'underline'
    },
    profile: {
        //marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
        marginTop: 1,
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
        // marginTop: -theme.SIZES.BASE,
        marginBottom: 0,
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        backgroundColor: theme.COLORS.WHITE,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 8,
        shadowOpacity: 0.2,
        zIndex: 2,
        marginTop: 55,
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
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginBottom: theme.SIZES.BASE,
        marginRight: 8,
    },
    product: {
        backgroundColor: theme.COLORS.WHITE,
        marginVertical: theme.SIZES.BASE,
        borderWidth: 0,
        minHeight: 114,
    },
    productTitle: {
        flex: 1,
        flexWrap: 'wrap',
        paddingBottom: 6,
    },
    productDescription: {
        padding: theme.SIZES.BASE / 2,
    },
    imageContainer: {
        elevation: 1,
    },
    image: {
        borderRadius: 3,
        marginHorizontal: theme.SIZES.BASE / 2,
        marginTop: 16,
    },
    horizontalImage: {
        height: 122,
        width: 'auto',
    },
    fullImage: {
        height: 215,
        width: width - theme.SIZES.BASE * 3,
    },
    shadow: {
        shadowColor: theme.COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
        shadowOpacity: 0.1,
        elevation: 2,
    },
    tabs: {
        marginBottom: 24,
        marginTop: 10,
        elevation: 4,
    },
    tab: {
        backgroundColor: theme.COLORS.TRANSPARENT,
        width: width * 0.50,
        borderRadius: 0,
        borderWidth: 0,
        height: 24,
        elevation: 0,
    },
});
