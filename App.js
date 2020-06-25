import React, { useState } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';
// import Constants from 'expo-constants';

function Separator() {
  return <View style={styles.separator} />;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: false,
    };

    abrirIrrigacao = () => {
      // Alert.alert('Left button pressed');
      // codigo para abrir a irrigação com mqtt
      this.setState({ status: true });
    };

    fecharIrrigacao = () => {
      // Alert.alert('Left button pressed');
      // codigo para abrir a irrigação com mqtt
      this.setState({ status: false });
    };

    storeError = () => {
      // Alert.alert('Estourou erro porra');
    };
  }

  // chamado ao entrar no aplicativo
  componentDidMount() {
    // visualizar estado atual da aplicação (se mangueira esta aberta ou fechada)
    // Alert.alert('Entrou na aplicação');
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>
            Irrigação ligará ao atingir 30% de umidade do solo
          </Text>
          <Separator />

          <Text style={styles.percentual}>
            Percentual humidade do solo: 70%
          </Text>
          <Text style={styles.status}>
            Irrigação {this.state.status == true ? 'aberta' : 'fechada'}
          </Text>
        </View>

        <Separator />
        <View>
          <View style={styles.buttons}>
            <Button
              title="  Abrir Irrigação  "
              onPress={() => {
                abrirIrrigacao();
              }}
            />
            <Button
              title=" Fechar Irrigação "
              onPress={() => {
                fecharIrrigacao();
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    marginHorizontal: 16,
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
    fontSize: 30,
  },
  percentual: {
    marginLeft: 20,
    fontSize: 20,
  },
  status: {
    textAlign: 'center',
    fontSize: 20,
  },
  buttons: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  separator: {
    marginVertical: 50,
    borderBottomColor: '#737373',
    // borderBottomWidth: StyleSheet.hairlineWidth, // adiciona linha cinza para separar
  },
});
