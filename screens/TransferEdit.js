import React from 'react';
import {
    StyleSheet,
    Dimensions,
    ScrollView,
    Image,
    Platform,
    TouchableWithoutFeedback,
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
import {Icon} from "../components";
const thumbMeasure = (width - 48 - 32) / 3;

var moment = require('moment');

export default class TransferEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            transfer_id: "",
            loaded: false,
            is_loading: true,
            current_transfer: {},
            current_transfer_client: {},
            first_name: "",
            middle_name: "",
            last_name: "",
            email: "",
            password: "",
            security_entities: [],
            transfer_nickname: "",
            client: "",
            client_id: "",
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
            transfer: {}

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
            // API.get("transfers", `/get/id/${params.id}`)
            //     .then(transfer_detail => {
            //         // console.log("transfers Details: ");
            //         // console.log(transfer_detail);
            //         this.setState({
            //             loaded: true,
            //             is_loading: false,
            //             ...transfer_detail
            //         });
            //     })
            //     .catch(error => {
            //         console.log(error);
            //     });

            API.get("transfers", `/get-full/id/${params.id}`)
                .then(response => {
                    console.log("FROM DETAILS");
                    console.log(response);
                    this.setState({
                        transfer: response.fullList,
                        payouts_list: response.payouts
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        }

        API.get("transfers", `/get_purpose/id/9`)
            .then(response => {
                this.setState({
                    purpose_list: response
                });
            })
            .catch(error => {
                console.log(error);
            });

        // API.get("clients", `/get-list-not-deleted`)
        //     .then(response => {
        //         this.setState({
        //             client_list: response
        //         });
        //     })
        //     .catch(error => {
        //         console.log(error);
        //     });

        API.get("beneficiaries", `/get-all`)
            .then(response => {
                this.setState({
                    beneficiaries_list: response
                });
                return response;
            });

        API.get("transfers", `/get/transfer-status`)
            .then(response => {
                this.setState({
                    transfer_status_list: response
                });
                return response;
            });

        API.get("currencies", `/currencies/get-all`)
            .then(response => {
                this.setState({
                    currencies_list: response
                });
                return response;
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

    saveTransferDetail(transfer_detail) {
        return API.put(
            "transfers",
            `/update/id/${this.props.transfer_detail_id}`,
            {
                body: transfer_detail
            }
        );
    }

    handleSubmit () {
        this.setState({ isLoading: true });

        try {
             this.saveTransferDetail({

                nickname: this.state.nickname,
                client_id: this.state.client_id,
                transaction_datetime: this.state.transaction_datetime,
                beneficiary_id: this.state.beneficiary_id,
                currency_from_id: this.state.currency_from_id,
                currency_to_id: this.state.currency_to_id,
                amount_from: this.state.amount_from,
                amount_to: this.state.amount_to,
                client_rate: this.state.client_rate,
                settlement_date: this.state.settlement_date,
                status: this.state.status
            });
            this.props.history.push(`/admin/TransferList`);
        } catch (e) {
            alert(e);
        }
    };

    render() {
        const {navigation} = this.props;
        if(this.state.payouts_list.length == 0) return (<Block><Image key={`loading-icon`} source={require('../assets/download.png')} /></Block>);

        let currency_option = this.state.currencies_list.map( (item, i) => {
            return <Picker.Item key={i} value={item.id}  label={item.iso_alpha_3} />
        });

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
                                    <Text bold>View</Text>
                                </Block>
                            </Block>
                            <Block>
                                <Text>From Currency</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', width: 295}}>
                                    <Picker
                                        style={ this.state.transfer.currency_from_id == "" ? {width: 295, height: 40} : {width: 295, height: 40}}
                                        selectedValue={this.state.transfer.currency_from_id}
                                        // onValueChange={this.handleCustomReactSelectChange("currency_from")}
                                    >
                                        {currency_option}
                                    </Picker>
                                </View>
                            </Block>

                            <Block>
                                <Text>To Currency</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', width: 295}}>
                                    <Picker
                                        style={ this.state.transfer.currency_to_id == "" ? {width: 295, height: 40} : {width: 295, height: 40}}
                                        selectedValue={this.state.transfer.currency_to_id}
                                        // onValueChange={this.handleCustomReactSelectChange("currency_from")}
                                    >
                                        {currency_option}
                                    </Picker>
                                </View>
                            </Block>

                            <Block><Text>Rate: {this.state.transfer.client_rate}</Text></Block>
                            <Block><Text>Settlement Date: {moment(this.state.transfer.settlement_date).format("DD/MM/YYYY")}</Text></Block>
                            <Block>
                                <Text>Beneficiary</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', width: 295}}>
                                    <Picker
                                        // style={ this.state.clientTransfers[0].beneficiary_id == "" ? {width: 295, height: 40} : { width: 295, height: 40}}
                                        selectedValue={this.state.payouts_list[0].beneficiary_id}
                                        // onValueChange={ (service) => ( this.setState({beneficiary:service}) ) }
                                        // onValueChange={this.handleSelectChange("beneficiary_id")}
                                    >
                                        {beneficiary_option}
                                    </Picker>
                                </View>
                            </Block>
                            <Block>
                                <Text>Purpose</Text>
                                <View style={{borderRadius: 10, borderWidth: 1, borderColor: '#bdc3c7', overflow: 'hidden', width: 295}}>
                                    <Picker
                                        // style={ this.state.payouts_list[0].purpose_of_payment_detail == "" ? {width: 295, height: 40} : {width: 295, height: 40}}
                                        selectedValue={this.state.payouts_list[0].purpose_of_payment_detail}
                                        // onValueChange={ (service) => ( this.setState({beneficiary:service}) ) }
                                        // onValueChange={this.handleSelectChange("purpose_of_payment_detail")}
                                    >
                                        {purpose_list_option}
                                    </Picker>
                                </View>
                            </Block>

                        </ScrollView>

                        {/*<Block style={{ marginRight: 10, width: 50 }}>*/}
                        {/*    <Button onPress={this.updateClient}>Update</Button>*/}
                        {/*</Block>*/}
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
});
