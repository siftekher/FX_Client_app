import React from 'react';
import {
    StyleSheet,
    Dimensions,
    ScrollView,
    Image,
    Platform,
    TouchableWithoutFeedback,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    View,
    Picker
} from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

const { width } = Dimensions.get('screen');
import womanImages from '../constants/images/woman';
import { API } from "aws-amplify";
import homeImages from "../constants/images/home";
import {HeaderHeight} from "../constants/utils";

import {materialTheme} from "../constants";
import {Icon, Select} from "../components";
import {errorIconColor} from "aws-amplify-react-native/dist/AmplifyTheme";
const thumbMeasure = (width - 48 - 32) / 3;

const axios = require('axios');
var moment = require('moment');

export default class TransferEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transfer_id: "",
            loaded: false,
            is_loading: true,
            currency_to: '',
            currency_from: '',
            transaction_datetime: "",
            beneficiary_name: "",
            client_list: [],
            currencies_list: [],
            currencies_list_priority: [],
            beneficiaries_list: [],
            transfer_status_list: [],
            beneficiary_id: "",
            beneficiary: {},
            currency_from_id: "",
            currency_to_id: "",
            amount_from: "",
            amount_to: "",
            client_rate: "",
            settlement_date: "",
            activeTab: "1",

            payouts_list: [],
            purpose_list: [],

            clientTransfers: [{
                beneficiary_id: "", amount: "", purpose_of_payment_detail: "",
                beneficiary_id_state: "", amount_state: "", purpose_of_payment_detail_state: "",
                detail_1: "", detail_2: "", detail_3: "",
                detail_1_state: "", detail_2_state: "", detail_3_state: "",
                document: "", purpose_of_payment_other: "",
                purpose_of_payment_other_state: "", beneficiary: {}, showDocumentUpload: false
            }],
        };
    }

    componentDidMount() {
        API.get("currencies", `/currencies/get-all`)
            .then(response => {
                // console.log(response);
                this.setState({ currencies_list: response });
                return response;
            });

        API.get("transfers", `/get_purpose/id/9`)
            .then(response => {
                // console.log(response);
                this.setState({ purpose_list: response });
            })
            .catch(error => {
                console.log(error);
            });

        API.get("beneficiaries", `/beneficiaries/get`)
            .then(response => {
                this.setState({
                    beneficiaries_list: response
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

        if(stateName == "amount_from"){
            let amount_to = Number.parseFloat(event.nativeEvent.text) * Number.parseFloat(this.state.client_rate);
            this.setState({ amount_to : amount_to.toString() });
        }

        if(stateName == "amount_to"){
            let amount_from = Number.parseFloat(event.nativeEvent.text) * Number.parseFloat(this.state.client_rate);
            this.setState({ amount_from : amount_from.toString() });
        }

    };
    handleCustomReactSelectChange = name => value => {
        this.setState({
            [name]: value,
        });

        let cur_list = this.state.currencies_list;

        if(name == "currency_from"){
            for(let i = 0; i<cur_list.length; i++){
                if(value == cur_list[i].id){
                    this.setState({
                        currency_from_name: cur_list[i].iso_alpha_3,
                    });
                }
            }
            this.setState({ ["currency_from_state"]: "Success" });
        }

        if(name == "currency_to"){
            for(let i = 0; i<cur_list.length; i++){
                if(value == cur_list[i].id){
                    this.setState({
                        currency_to_name: cur_list[i].iso_alpha_3,
                    });
                }
            }
            this.setState({ ["currency_to_state"]: "Success" });
        }
        this.fetchNewRate();
    }

    handleSelectChange = name => value => {
        let clientTransfers = [...this.state.clientTransfers];
        clientTransfers[0] = { ...clientTransfers[0], [name]: value };
        clientTransfers[0] = { ...clientTransfers[0], [name+ "_state"]: "Success" };
        this.setState({ clientTransfers });
    }

    fetchNewRate = () => {
        if (this.state.currency_from && this.state.currency_to) {
            let url = `https://apilayer.net/api/live?access_key=a4eb7fd0501842eb4d4712cc459cae5f`
            axios.get(url, {
                params: {
                    currencies: this.state.currency_to_name,
                    source: this.state.currency_from_name,
                    format: "1"
                }
            })
                .then((response) => {
                    let key = `${this.state.currency_from_name.toUpperCase()}${this.state.currency_to_name.toUpperCase()}`
                    let rate_string = response.data.quotes[key]

                    let rate = Number.parseFloat(rate_string);

                    this.setState({
                        client_rate: rate.toString(),
                    });
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }

    getNextBusinessDay(d, n) {
        d = new Date(d.getTime());
        var day = d.getDay();
        d.setDate(d.getDate() + n + (day === 6 ? 2 : +!day) + (Math.floor((n - 1 + (day % 6 || 1)) / 5) * 2));
        return d;
    }

    isValidate() {
        let return_flag = true;
        //Validation goes here
        if(this.state.currency_from == ""){
            this.setState({currency_from_state: "Error" });
            return_flag = false;
        } else {
            this.setState({ currency_from_state: "Success" });
        }

        if(this.state.currency_to == "") {
            this.setState({ currency_to_state: "Error" });
            return_flag = false;
         } else {
            this.setState({ currency_to_state: "Success" });
        }
        if(this.state.amount_from == "") {
            this.setState({ amount_from_state: "Error" });
            return_flag = false;
        } else {
            this.setState({ amount_from_state: "Success" });
        }
        if(this.state.amount_to == "") {
            this.setState({ amount_to_state: "Error" });
            return_flag = false;
        } else {
            this.setState({ amount_to_state: "Success" });
        }
        if(this.state.clientTransfers[0].beneficiary_id == "") {
            let clientTransfers = [...this.state.clientTransfers];
            clientTransfers[0] = { ...clientTransfers[0], ["beneficiary_id_state"]: "Error" };
            this.setState({ clientTransfers });
            return_flag = false;
        } else {
            let clientTransfers = [...this.state.clientTransfers];
            clientTransfers[0] = { ...clientTransfers[0], ["beneficiary_id_state"]: "Success" };
            this.setState({ clientTransfers });
        }

        if(this.state.clientTransfers[0].purpose_of_payment_detail == "") {
            let clientTransfers = [...this.state.clientTransfers];
            clientTransfers[0] = { ...clientTransfers[0], ["purpose_of_payment_detail_state"]: "Error" };
            this.setState({ clientTransfers });
            return_flag = false;
        } else {
            let clientTransfers = [...this.state.clientTransfers];
            clientTransfers[0] = { ...clientTransfers[0], ["purpose_of_payment_detail_state"]: "Success" };
            this.setState({ clientTransfers });
        }

        return return_flag;
    }

    async saveTransferDetail(transfer_detail) {
        const {navigation} = this.props;
        await API.post(
            "transfers",
            `/create/in-database-mob`,
            {
                body: transfer_detail
            }
        ).then(function(data) {
            console.log(data);
            navigation.navigate('Man', {token: "reload"});
        }).catch(err => console.log(err));

        //this.props.navigation.navigate('Man', {token: "reload"});
    }

    saveTransfer = () => {
        let return_flag = this.isValidate();

        if(return_flag) {
            console.log("Good ! ");
            this.setState({isLoading: true});

            let set_date = this.getNextBusinessDay(new Date(), 3);
            let settlement_date = set_date.toISOString().slice(0, 10).replace('T', ' ');

            try {
                this.saveTransferDetail({
                    nickname: `FX Transfer ${moment().format('DD/MM/YY')} `,
                    record_created_datetime: new Date().toISOString().slice(0, 19).replace("T", " "),
                    currency_from_id: this.state.currency_from,
                    currency_to_id: this.state.currency_to,
                    amount_from: this.state.amount_from,
                    amount_to: this.state.amount_to,
                    client_rate: this.state.client_rate,
                    transaction_datetime: new Date().toISOString().slice(0, 10).replace("T", " "),
                    settlement_date: settlement_date,
                    status: 2,
                    beneficiary_ids: this.state.clientTransfers
                });
                //this.props.navigation.navigate('Man', {token: "reload"});
            } catch (e) {
                alert(e);
            }
        } else {
            console.log("NOT GOOD !");
        }
    };


    handleSelect(value){
        console.log(value);
    }
    handleOnSelect = (index, value) => {
        const { onSelect } = this.props;
    }

    render() {
        const {navigation} = this.props;

        let choose_currency = <Picker.Item key={0} value={""}  label="Select Currency" />;

        let currency_option = this.state.currencies_list.map( (item, i) => {
            return <Picker.Item key={i} value={item.id}  label={item.iso_alpha_3} />
        });

        let choose_beneficiary = <Picker.Item key={0} value={""}  label="Select" />;
        let beneficiary_option = this.state.beneficiaries_list.map( (item, i) => {
            return <Picker.Item key={i} value={item.id} label={item.nickname} />
        });

        let purpose_list_option = this.state.purpose_list.map( (item, i) => {
            return <Picker.Item key={i} value={item.id} label={item.description} />
        });

        return (

            <Block flex style={styles.profile}>
                <Block flex={0.92}>
                    <Block style={styles.options}>
                        <ScrollView vertical={true} showsVerticalScrollIndicator={false}>

                            <Block row space="between" style={{ padding: theme.SIZES.BASE, }}>
                                <Block middle>
                                    <Text bold>Add</Text>
                                </Block>
                            </Block>
                            <Block>
                                <Text>From Currency</Text>
                                <View style={this.state.currency_from_state == "Error" ? {borderRadius: 10, borderWidth: 1, borderColor: 'red', overflow: 'hidden', width: 295}: {borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', width: 295}}>
                                    <Picker
                                        style={ {width: 295, height: 40}}
                                        selectedValue={this.state.currency_from}
                                        onValueChange={this.handleCustomReactSelectChange("currency_from")}
                                    >
                                        {choose_currency}
                                        {currency_option}
                                    </Picker>
                                </View>
                            </Block>
                            <Block>
                                <Text>To Currency</Text>
                                <View style={this.state.currency_to_state == "Error" ? {borderRadius: 10, borderWidth: 1, borderColor: 'red', overflow: 'hidden', width: 295} : {borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', width: 295}}>
                                    <Picker
                                        style={{width: 295, height: 40}}
                                        selectedValue={this.state.currency_to}
                                        onValueChange={this.handleCustomReactSelectChange("currency_to")}
                                    >
                                        {choose_currency}
                                        {currency_option}
                                    </Picker>
                                </View>
                            </Block>
                            <Block><Text>Rate: {this.state.client_rate}</Text></Block>

                            <Block>
                                <Text>From Amount</Text>
                                <Input
                                    style={ this.state.amount_from_state == "Error" ? {borderColor: 'red', borderWidth: 1, borderRadius: 5, height: 40, paddingLeft:10} : {paddingLeft:10, borderColor: 'grey', borderWidth: 1, borderRadius: 5, height: 40}}
                                    placeholder="From Amount"
                                    value= {this.state.amount_from || ""}
                                    onChange={e => this.change(e, "amount_from", "number", 1)}
                                />
                            </Block>
                            <Block>
                                <Text>To Amount</Text>
                                <Input
                                    style={ this.state.amount_to_state == "Error" ? {borderColor: 'red', borderWidth: 1, borderRadius: 5, height: 40, paddingLeft:10} : {paddingLeft:10, borderColor: 'grey', borderWidth: 1, borderRadius: 5, height: 40}}
                                    placeholder="To Amount"
                                    value= {this.state.amount_to || ""}
                                    onChange={e => this.change(e, "amount_to", "number", 1)}/>
                            </Block>

                            <Block>
                                <Text>Beneficiary</Text>
                                <View style={this.state.clientTransfers[0].beneficiary_id_state == "Error" ? {borderRadius: 10, borderWidth: 1, borderColor: 'red', overflow: 'hidden', width: 295} : {borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', width: 295}}>
                                    <Picker
                                        style={{ width: 295, height: 40}}
                                        selectedValue={this.state.clientTransfers[0].beneficiary_id}
                                        onValueChange={this.handleSelectChange("beneficiary_id")}
                                    >
                                        {choose_beneficiary}
                                        {beneficiary_option}
                                    </Picker>
                                </View>
                            </Block>

                            <Block style={{ marginBottom: 10 }}>
                                <Text>Purpose</Text>
                                <View style={this.state.clientTransfers[0].purpose_of_payment_detail_state == "Error" ? {borderRadius: 10, borderWidth: 1, borderColor: 'red', overflow: 'hidden', width: 295} : {borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', width: 295}}>
                                    <Picker
                                        style={{width: 295, height: 40}}
                                        selectedValue={this.state.clientTransfers[0].purpose_of_payment_detail}
                                        onValueChange={this.handleSelectChange("purpose_of_payment_detail")}
                                    >
                                        {choose_beneficiary}
                                        {purpose_list_option}
                                    </Picker>
                                </View>
                            </Block>
                        </ScrollView>

                        <Block>
                            <View style={{ marginRight: 10, width: 300, height: 40 }}>
                                <Button style={{ marginRight: 10, width: 300, height: 40 }} onPress={this.saveTransfer}>Save</Button>
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
    dropdown: {
        marginTop: theme.SIZES.BASE / 2,
        marginLeft: -theme.SIZES.BASE,
        width: theme.SIZES.BASE * 6,
    },
    qty: {
        width: theme.SIZES.BASE * 6,
        backgroundColor: materialTheme.COLORS.DEFAULT,
        paddingHorizontal: theme.SIZES.BASE,
        paddingTop: 10,
        paddingBottom: 9.5,
        borderRadius: 3,
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 1,
    },
});
