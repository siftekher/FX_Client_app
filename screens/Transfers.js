import React from 'react';
import {StyleSheet, Dimensions, ScrollView, Image,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';
import { API } from "aws-amplify";
// import { Icon, Product } from '../components/';

const { width } = Dimensions.get('screen');
import Images from './../assets/images';
var moment = require('moment');

export default class Man extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transfers_list: []
    };
  }

  componentDidMount() {
    API.get("transfers", `/get-list-not-deleted`)
        .then(response => {
          this.setState({
            transfers_list: response
          });
        })
        .catch(error => {
          console.log(error);
        });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.token) {
      console.log(nextProps.navigation.state.params.token);
      API.get("transfers", `/get-list-not-deleted`)
          .then(response => {
            console.log("FROM componentWillReceiveProps");
            console.log(response);
            this.setState({
              transfers_list: response
            });
          })
          .catch(error => {
            console.log(error);
          });
    }
  }

  imageSelect = network => {
    if (network === null) {
      return Images.flags.other;
    }

    const networkArray = {
      'AUD': Images.flags.aud,
      'USD': Images.flags.usd,
      'GBP': Images.flags.gbp,
      'NZD': Images.flags.nzd,
      'AED': Images.flags.aed,
      'AFN': Images.flags.afn,
      'AMD': Images.flags.amd,
      'ANG':Images.flags.ang,

      'AOA':Images.flags.aoa,
      'ARS':Images.flags.ars,
      'AWG':Images.flags.awg,
      'AZN':Images.flags.azn,
      'BAM':Images.flags.bam,
      'BBD':Images.flags.bbd,
      'BDT':Images.flags.bdt,
      'BGN':Images.flags.bgn,
      'BHD':Images.flags.bhd,
      'BIF':Images.flags.bif,
      'BMD':Images.flags.bmd,
      'BND':Images.flags.bnd,
      'BOB':Images.flags.bob,
      'BRL':Images.flags.brl,
      'BSD': Images.flags.bsd,
      'BTN': Images.flags.btn,
      'BWP': Images.flags.bwp,
      'BYN': Images.flags.byn,
      'BZD': Images.flags.bzd,
      'CAD': Images.flags.cad,
      'CDF': Images.flags.cdf,
      'CHF': Images.flags.chf,
      'CLP': Images.flags.clp,
      'CNY': Images.flags.cny,
      'COP': Images.flags.cop,
      'CRC': Images.flags.crc,
      'CUP': Images.flags.cup,
      'CVE': Images.flags.cve,

        'CZK':Images.flags.czk,

        'DJF':Images.flags.djf,
        'DKK':Images.flags.dkk,
        'DOP':Images.flags.dop,
        'DZD':Images.flags.dzd,
        'EGP':Images.flags.egp,
        'ERN':Images.flags.ern,
        'ETB':Images.flags.etb,
        'EUR':Images.flags.eur,
        'FJD':Images.flags.fjd,
        'FKP':Images.flags.fkp,
        'GEL':Images.flags.gel,
        'GHS':Images.flags.ghs,
        'GIP':Images.flags.gip,
        'GMD':Images.flags.gmd,
        'GNF':Images.flags.gnf,
        'GTQ':Images.flags.gtq,
        'GYD':Images.flags.gyd,
        'HKD':Images.flags.hkd,
        'HNL':Images.flags.hnl,
        'HRK':Images.flags.hrk,
        'HTG':Images.flags.htg,
        'HUF':Images.flags.huf,
        'IDR':Images.flags.idr,
        'ILS':Images.flags.ils,
        'INR':Images.flags.inr,
        'IQD':Images.flags.iqd,
        'IRR':Images.flags.irr,
        'ISK':Images.flags.isk,
        'JMD':Images.flags.jmd,
        'JOD':Images.flags.jod,
        'JPY':Images.flags.jpy,
        'KES':Images.flags.kes,
        'KGS':Images.flags.kgs,
        'KHR':Images.flags.khr,
        'KMF':Images.flags.kmf,
        'KPW':Images.flags.kpw,
        'KRW':Images.flags.krw,
        'KWD':Images.flags.kwd,
        'KYD':Images.flags.kyd,
        'KZT':Images.flags.kzt,
        'LAK':Images.flags.lak,
        'LBP':Images.flags.lbp,
        'LKR':Images.flags.lkr,
        'LRD':Images.flags.lrd,
        'LTL':Images.flags.ltl,
        'LYD':Images.flags.lyd,
        'MAD':Images.flags.mad,
        'MDL':Images.flags.mdl,
        'MGA':Images.flags.mga,
        'MKD':Images.flags.mkd,
        'MMK':Images.flags.mmk,
        'MNT':Images.flags.mnt,
        'MOP':Images.flags.mop,
        'MRO':Images.flags.mro,
        'MUR':Images.flags.mur,
        'MVR':Images.flags.mvr,
        'MWK':Images.flags.mwk,
        'MXN':Images.flags.mxn,
        'MYR':Images.flags.myr,
        'MZN':Images.flags.mzn,
        'NAD':Images.flags.nad,
        'NGN':Images.flags.ngn,
        'NIO':Images.flags.nio,
        'NOK':Images.flags.nok,
        'NPR':Images.flags.npr,
        'OMR':Images.flags.omr,
        'PEN':Images.flags.pen,
        'PGK':Images.flags.pgk,
        'PHP':Images.flags.php,
        'PKR':Images.flags.pkr,
        'PLN':Images.flags.pln,
        'PYG':Images.flags.pyg,
        'QAR':Images.flags.qar,
        'RON':Images.flags.ron,
        'RSD':Images.flags.rsd,
        'RUB':Images.flags.rub,
        'RWF':Images.flags.rwf,
        'SAR':Images.flags.sar,
        'SBD':Images.flags.sbd,
        'SCR':Images.flags.scr,
        'SEK':Images.flags.sek,
        'SGD':Images.flags.sgd,
        'SHP':Images.flags.shp,
        'SLL':Images.flags.sll,
        'SOS':Images.flags.sos,
        'SRD':Images.flags.srd,
        'STD':Images.flags.std,
        'SVC':Images.flags.svc,
        'SYP':Images.flags.syp,
        'SZL':Images.flags.szl,
        'THB':Images.flags.thb,
        'TJS':Images.flags.tjs,
        'TND':Images.flags.tnd,
        'TOP':Images.flags.top,
        'TRY':Images.flags.try,
        'TTD':Images.flags.ttd,
        'TWD':Images.flags.twd,
        'TZS':Images.flags.tzs,
        'UAH':Images.flags.uah,
        'UGX':Images.flags.ugx,
        'UYU':Images.flags.uyu,
        'UZS':Images.flags.uzs,
        'VEF':Images.flags.vef,
        'VND':Images.flags.vnd,
        'VUV':Images.flags.vuv,
        'WST':Images.flags.wst,
        'XAF':Images.flags.xaf,
        'XCD':Images.flags.xcd,
        'XOF':Images.flags.xof,
        'XPF':Images.flags.xpf,
        'YER':Images.flags.yer,
        'ZAR':Images.flags.zar,
        'ZMW':Images.flags.zmw,


        'Other': Images.flags.other,
    };

    return networkArray[network];
  };

  currencyFormat = (num) => {
    return  num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }


  render() {
    const { navigation } = this.props;
    if(this.state.transfers_list.length == 0) return (<Block><Image key={`loading-icon`} source={require('../assets/download.png')} /></Block>);

    return (
        <Block flex style={styles.profile}>
          <Block flex={0.92} style={{marginTop: 10}}>
            <Block style={styles.options}>
              <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
                    {this.state.transfers_list.map((prop, key) => {
                      return (
                          <Block row card flex key={`main-transfer-row-${prop.id}`}>
                            <TouchableWithoutFeedback onPress={() => navigation.navigate('TransferEdit', { id: prop.id })}>
                              <View key={`main-transfer-row-${prop.id}`} style={{ flexDirection: 'row', marginBottom: 10,height: 65, marginLeft:10, borderBottomColor: 'black', borderBottomWidth: 1, marginRight:10 }}>
                                <View style={{width: '32%'}}>
                                  <Image key={`curr-image-${prop.id}`} source={this.imageSelect(prop.currency_from_iso_alpha_3)} />
                                  <Text size={14} key={`from-iso-alpha-${prop.id}`} >{prop.currency_from_iso_alpha_3}: {this.currencyFormat(prop.amount_from)}</Text>
                                </View>
                                <View style={{width: '30%'}}>
                                  <Text size={14} key={`client-rate-text-${prop.id}`} >Rate:{prop.client_rate}</Text>
                                  <Text size={14} key={`settle-date-${prop.id}`} >{moment(prop.settlement_date).format("DD/MM/YYYY")}</Text>
                                </View>
                                <View style={{width: '32%'}}>
                                  <Image key={`from-image-${prop.id}`} source={this.imageSelect(prop.currency_to_iso_alpha_3)} />
                                  <Text size={14} key={`to-iso-alpha-${prop.id}`} >{prop.currency_to_iso_alpha_3}: {this.currencyFormat(prop.amount_to)}</Text>
                                </View>
                              </View>
                            </TouchableWithoutFeedback>
                          </Block>
                      );
                    })}
              </ScrollView>
            </Block>
          </Block>
        </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
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
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
  productDescription: {
    padding: theme.SIZES.BASE / 2,
  },
});
