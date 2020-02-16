import React from 'react';
import {StyleSheet, Dimensions, ScrollView, Image, Platform, TouchableWithoutFeedback, View} from 'react-native';
import { Button, Block, Text, Input, theme } from 'galio-framework';

import { Icon, Product, CustomList } from '../components/';

const { width } = Dimensions.get('screen');
import womanImages from '../constants/images/woman';
import { API } from "aws-amplify";
import homeImages from "../constants/images/home";
import {HeaderHeight} from "../constants/utils";

import {materialTheme} from "../constants";
const thumbMeasure = (width - 48 - 32) / 4;
import Images from './../assets/images';

export default class Woman extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      beneficiary_list: []
    };
  }

  componentDidMount() {
    API.get("beneficiaries", `/beneficiaries/get`)
        .then(response => {
          this.setState({
            beneficiary_list: response
          });
        })
        .catch(error => {
          console.log(error);
        });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.navigation.state.params.token) {
      API.get("beneficiaries", `/beneficiaries/get`)
          .then(response => {
            this.setState({
              beneficiary_list: response
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

      'Other': Images.flags.other
    };

    return networkArray[network];
  };

  render() {
    const { navigation } = this.props;
/*
                        <Block row card flex style={[styles.product, styles.shadow]} key={`inside-block-${prop.id}`}>
                          <TouchableWithoutFeedback key={`left-touch-${prop.id}`} onPress={() => navigation.navigate('BeneficiaryEdit', { id: prop.id })}>
                            <Block key={`left-block-${prop.id}`} flex style={[styles.imageContainer, styles.shadow]}>
                              <Image style={imageStyles} key={`curr-image-${prop.id}`} source={this.imageSelect(prop.currency_short_name)} />
                            </Block>
                          </TouchableWithoutFeedback>
                          <TouchableWithoutFeedback key={`right-touch-${prop.id}`} onPress={() => navigation.navigate('BeneficiaryEdit', { id: prop.id })}>
                            <Block key={`right-block-${prop.id}`} flex space="between" style={styles.productDescription}>
                              <Text size={14} key={`ben-title-${prop.id}`} style={styles.productTitle}>{prop.nickname}</Text>
                              <Text size={12} key={`short-name-${prop.id}`} >{prop.currency_short_name}</Text>
                            </Block>
                          </TouchableWithoutFeedback>
                        </Block>
 */
    if(this.state.beneficiary_list.length == 0) return (<Block><Image key={`loading-icon`} source={require('../assets/download.png')} /></Block>);
    const imageStyles = [styles.image, styles.horizontalImage, styles.thumb ];
    return (
        <Block flex style={styles.profile}>
          <Block flex={0.92}>
            <Block style={styles.options}>
              <ScrollView vertical={true} showsVerticalScrollIndicator={false}>
                  {this.state.beneficiary_list.map((prop, key) => {
                    return (

                    <Block row card flex key={`main-transfer-row-${prop.id}`}>
                      <TouchableWithoutFeedback onPress={() => navigation.navigate('BeneficiaryEdit', { id: prop.id })}>
                        <View key={`main-transfer-row-${prop.id}`} style={{ flexDirection: 'row',marginTop:5, marginBottom: 10,height: 65, marginLeft:10, borderBottomColor: 'black', borderBottomWidth: 1, marginRight:10 }}>
                          <View style={{width: '35%'}}>
                            <Image key={`curr-image-${prop.id}`} source={this.imageSelect(prop.currency_short_name)} />
                            <Text size={14} key={`from-iso-alpha-${prop.id}`} >{prop.currency_short_name}</Text>
                          </View>
                          <View style={{width: '60%'}}>
                            <Text size={14} key={`to-iso-alpha-${prop.id}`} >{prop.nickname}</Text>
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
  profile: {
    //marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
      marginTop: 1
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
      width:30,
      height:30,
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
});
