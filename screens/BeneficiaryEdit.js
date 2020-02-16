import React from 'react';
import {
    StyleSheet,
    Dimensions,
    ScrollView,
    Image,
    Platform,
    TouchableWithoutFeedback,
    Picker,
    View
} from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

const { width } = Dimensions.get('screen');
import womanImages from '../constants/images/woman';
import { API } from "aws-amplify";
import homeImages from "../constants/images/home";
import {HeaderHeight} from "../constants/utils";

import {materialTheme} from "../constants";
import {Icon} from "../components";
const thumbMeasure = (width - 48 - 32) / 3;

export default class BeneficiaryEdit extends React.Component {
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
            editViewFlag: false
        };
    }

    componentDidMount() {
        // console.log(this.props);
        const { navigation } = this.props;
        const { params } = navigation && navigation.state;

        if(params.id){
            this.setState({
                bene_id: params.id
            });
            API.get("beneficiaries", `/get/id/${params.id}`)
                .then(beneficiary_detail => {
                    console.log("Beneficiary Details: ");
                    console.log(beneficiary_detail);
                    this.setState({
                        loaded: true,
                        is_loading: false,
                        id: beneficiary_detail.id,
                        nickname: beneficiary_detail.nickname,
                        legal_type: beneficiary_detail.legal_type,
                        ben_legal_name: beneficiary_detail.ben_legal_name,

                        //show ben address data from here
                        ben_address_line_1: beneficiary_detail.ben_address_line_1,
                        ben_address_line_2: beneficiary_detail.ben_address_line_2,
                        ben_address_suburb: beneficiary_detail.ben_address_suburb,
                        ben_address_state: beneficiary_detail.ben_address_state,
                        ben_address_postcode:
                        beneficiary_detail.ben_address_postcode,
                        ben_address_country:
                        beneficiary_detail.ben_address_country,

                        //show bank address data from here
                        bank_legal_name: beneficiary_detail.bank_legal_name,
                        bank_address_line_1: beneficiary_detail.bank_address_line_1,
                        bank_address_line_2: beneficiary_detail.bank_address_line_2,
                        bank_address_suburb: beneficiary_detail.bank_address_suburb,
                        bank_address_state: beneficiary_detail.bank_address_state,
                        bank_address_postcode:
                        beneficiary_detail.bank_address_postcode,
                        bank_address_country:
                        beneficiary_detail.bank_address_country,

                        //show bank detail data from here
                        account_currency: beneficiary_detail.account_currency,
                        swift_code: beneficiary_detail.swift_code,
                        account_number: beneficiary_detail.account_number,
                        aba_routing_number: beneficiary_detail.aba_routing_number,
                        bsb_code: beneficiary_detail.bsb_code,
                        sort_code: beneficiary_detail.sort_code,

                        //show contact data from here
                        ben_telephone_work: beneficiary_detail.ben_telephone_work,
                        ben_telephone_afterhours: beneficiary_detail.ben_telephone_afterhours,
                        ben_telephone_mobile: beneficiary_detail.ben_telephone_mobile,

                        ben_email_main: beneficiary_detail.ben_email_main,
                        ben_email_secondary: beneficiary_detail.ben_email_secondary
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }


        API.get("currencies", `/currencies/get-all`)
            .then(response => {
                this.setState({
                    currencies_list: response
                });
            })
            .catch(error => {
                console.log(error);
            });

        API.get("countries", `/countries/get-all`)
            .then(response => {
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

    isValidate(){
        let return_flag = true;
        //Validation goes here
        if(this.state.account_currency == "") return_flag = false;
        if(this.state.ben_legal_name == "") return_flag = false;
        if(this.state.nickname == "") return_flag = false;

        return return_flag;
    }

    saveBeneficiaryDetail(beneficiary_detail) {
        const {navigation} = this.props;
        API.put(
            "beneficiaries",
            `/update/id/${this.state.bene_id}`,
            {
                body: beneficiary_detail
            }
        ).then(function(data) {
            navigation.navigate('Woman', {token: "reload"});
        }).catch(err => console.log(err));
    }

    updateBeneficiary() {

        if(this.isValidate()) {
            const {
                id,
                nickname,
                legal_type,
                ben_legal_name,
                // email

                //ben address
                ben_address_line_1,
                ben_address_line_2,
                ben_address_suburb,
                ben_address_state,
                ben_address_postcode,
                ben_address_country,

                //bank address
                bank_legal_name,
                bank_address_line_1,
                bank_address_line_2,
                bank_address_suburb,
                bank_address_state,
                bank_address_postcode,
                bank_address_country,

                //bank details
                account_currency,
                swift_code,
                account_number,
                aba_routing_number,
                bsb_code,
                sort_code,

                //contacts
                ben_telephone_work,
                ben_telephone_afterhours,
                ben_telephone_mobile,
                ben_email_main,
                ben_email_secondary,

                ben_abn_name,
                ben_acn_name,
                ben_trust_name,

            } = this.state;
            try {
                this.saveBeneficiaryDetail({
                    id: id,
                    nickname: nickname,
                    legal_type: legal_type,
                    ben_legal_name: ben_legal_name,

                    ben_address_line_1: ben_address_line_1,
                    ben_address_line_2: ben_address_line_2,
                    ben_address_suburb: ben_address_suburb,
                    ben_address_state: ben_address_state,
                    ben_address_postcode: ben_address_postcode,
                    ben_address_country: ben_address_country,

                    bank_legal_name: bank_legal_name,
                    bank_address_line_1: bank_address_line_1,
                    bank_address_line_2: bank_address_line_2,
                    bank_address_suburb: bank_address_suburb,
                    bank_address_state: bank_address_state,
                    bank_address_postcode: bank_address_postcode,
                    bank_address_country: bank_address_country,

                    account_currency: account_currency,
                    swift_code: swift_code,
                    account_number: account_number,
                    aba_routing_number: aba_routing_number,
                    bsb_code: bsb_code,
                    sort_code: sort_code,

                    ben_telephone_work: ben_telephone_work,
                    ben_telephone_afterhours: ben_telephone_afterhours,
                    ben_telephone_mobile: ben_telephone_mobile,
                    ben_email_main: ben_email_main,
                    ben_email_secondary: ben_email_secondary,

                    ben_abn_name: ben_abn_name,
                    ben_acn_name: ben_acn_name,
                    ben_trust_name: ben_trust_name

                });
                this.props.navigation.navigate('Woman', {token: "reload"});
            } catch (e) {
                //alert(e);
            }
        }
    };


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
                                <View style={this.state.account_currency == "" ? {borderRadius: 5, borderWidth: 1, borderColor: 'red', overflow: 'hidden', width: 295} : {borderRadius: 5, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', width: 295}}>
                                    <Picker
                                        style={ {width: 295, height: 40}}
                                        selectedValue={this.state.account_currency}
                                        onValueChange={ (service) => ( this.setState({account_currency:service}) ) } >
                                        {choose_currency}
                                        {currency_option}
                                    </Picker>
                                </View>
                            </Block>
                            <Block>
                                <Text>Account Name</Text>
                                <Input key={`account-name-add`} placeholder="Name" value= {this.state.ben_legal_name || ""} onChange={e => this.change(e, "ben_legal_name", "length", 1)}/>
                            </Block>
                            <Block>
                                <Text>Nickname</Text>
                                <Input key={`ben-nickname-add`} placeholder="nickname" value= {this.state.nickname || ""} onChange={e => this.change(e, "nickname", "length", 1)}/>
                            </Block>

                            <Block>
                                <Text>Email</Text>
                                <Input key={`ben-nickname-add`} placeholder="Email" value= {this.state.ben_email_main || ""} onChange={e => this.change(e, "ben_email_main", "length", 1)}/>
                            </Block>
                            <Block>
                                <Text>Address</Text>
                                <Input key={`ben-nickname-add`} placeholder="Address " value= {this.state.ben_address_line_1 || ""} onChange={e => this.change(e, "ben_address_line_1", "length", 1)}/>
                            </Block>


                            <Block>
                                <Text>Address 2</Text>
                                <Input key={`ben-nickname-add`} placeholder="Address 2" value= {this.state.ben_address_line_2 || ""} onChange={e => this.change(e, "ben_address_line_2", "length", 1)}/>
                            </Block>

                            <Block>
                                <Text>Suburb</Text>
                                <Input key={`ben-nickname-add`} placeholder="Suburb" value= {this.state.ben_address_suburb || ""} onChange={e => this.change(e, "ben_address_suburb", "length", 1)}/>
                            </Block>

                            <Block>
                                <Text>State</Text>
                                <Input key={`ben-nickname-add`} placeholder="State" value= {this.state.ben_address_state || ""} onChange={e => this.change(e, "ben_address_state", "length", 1)}/>
                            </Block>

                            <Block>
                                <Text>Postcode</Text>
                                <Input key={`ben-nickname-add`} placeholder="Postcode" value= {this.state.ben_address_postcode || ""} onChange={e => this.change(e, "ben_address_postcode", "length", 1)}/>
                            </Block>

                            <Block>
                                <Text>Country</Text>
                                <View style={{borderRadius: 5, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', width: 295, marginBottom:10}}>
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
                               <Button style={{ marginRight: 10, width: 300, height: 40 }} onPress={this.updateBeneficiary}>Update</Button>
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
        width: 250,
        backgroundColor: '#FF0000',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 4,
    },
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
