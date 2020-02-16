import React from 'react';
import {Platform, StatusBar, Image} from 'react-native';
import {AppLoading, Asset,} from 'expo';
import {Block, GalioProvider} from 'galio-framework';

import Screens from './navigation/Screens';
import {Images, materialTheme} from './constants/';


import Amplify from 'aws-amplify';
import config from './config/awsConfig';
import configClients from './config/awsConfigClients';
import configBeneficiaries from './config/awsConfigBeneficiaries';
import configCountries from './config/awsConfigCountries';
import configCurrencies from './config/awsConfigCurrencies';
import configTransfers from './config/awsConfigTransfers';

import {withAuthenticator} from 'aws-amplify-react-native'; // or 'aws-amplify-react-native';

Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID
    },
    Analytics: {
      disabled: true
    },
    Storage: {
      region: config.s3.REGION,
      bucket: config.s3.BUCKET,
      identityPoolId: config.cognito.IDENTITY_POOL_ID
    },
    API: {
      endpoints: [
        {
          name: "app",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
        {
          name: "clients",
          endpoint: configClients.apiGateway.URL,
          region: configClients.apiGateway.REGION
        },
        {
          name: "beneficiaries",
          endpoint: configBeneficiaries.apiGateway.URL,
          region: configBeneficiaries.apiGateway.REGION
        },
        {
          name: "countries",
          endpoint: configCountries.apiGateway.URL,
          region: configCountries.apiGateway.REGION
        },
        {
          name: "currencies",
          endpoint: configCurrencies.apiGateway.URL,
          region: configCurrencies.apiGateway.REGION
        },
        {
          name: "transfers",
          endpoint: configTransfers.apiGateway.URL,
          region: configTransfers.apiGateway.REGION
        }




      ]
    }
  }
);


const assetImages = [
  Images.Profile,
  Images.Avatar,
  Images.Onboarding,
  Images.Products.Auto,
  Images.Products.Motocycle,
  Images.Products.Watches,
  Images.Products.Makeup,
  Images.Products.Accessories,
  Images.Products.Fragrance,
  Images.Products.BMW,
  Images.Products.Mustang,
  Images.Products['Harley-Davidson'],
];

// cache product images
// products.map(product => assetImages.push(product.image));

// cache categories images
// Object.keys(categories).map(key => {
//   categories[key].map(category => assetImages.push(category.image));
// });

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}


class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <GalioProvider theme={materialTheme}>
          <Block flex>
            {Platform.OS === 'ios' && <StatusBar barStyle="default"/>}
            <Screens/>
          </Block>
        </GalioProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      ...cacheImages(assetImages),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({isLoadingComplete: true});
  };
}


export default withAuthenticator(App, false);
