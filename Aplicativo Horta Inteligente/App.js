import React, { useState } from 'react';
import { Buffer } from 'buffer';
import MQTT from 'sp-react-native-mqtt';

import {
  AsyncStorage,
  StyleSheet,
  Button,
  View,
  SafeAreaView,
  Text,
  Alert,
} from 'react-native';

function Separator() {
  return <View style={styles.separator} />;
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: false,
      cliente: 0,
      umidade: 0,
    };

    MQTT.createClient({
      uri: 'mqtt://broker.mqttdashboard.com:1883',
      clientId: 'your_client_id',
    })
      .then((client) => {
        this.setState({ cliente: client });
        client.on('closed', () => {
          console.log('mqtt.event.closed');
        });

        client.on('error', (msg) => {
          console.log('mqtt.event.error', msg);
        });

        client.on('message', (msg) => {
          console.log('mqtt.event.message', msg);
          if (msg.data === 'abrir') {
            this.setState({ status: true });
          } else if (msg.data === 'fechar') {
            this.setState({ status: false });
          } else if (msg.topic === '5954326/umidade') {
            this.setState({ umidade: msg.data });
          }
        });

        client.on('connect', () => {
          console.log('connected');
          client.subscribe('5954326/status', 2);
          client.subscribe('5954326/umidade', 2);
          client.publish('5954326/status', 'Menssage From App', 0, false);
        });

        // client.publish('/piique', 'test', 0, false);

        client.connect();
      })
      .catch((err) => {
        console.log('Erro cabuloso: ', err);
      });

    abrirIrrigacao = () => {
      // Alert.alert('Left button pressed');
      // codigo para abrir a irrigação com mqtt
      console.log(this.state.cliente);
      this.state.cliente.publish('5954326/status', 'abrir', 0, false);
      this.setState({ status: true });
    };

    fecharIrrigacao = () => {
      // Alert.alert('Left button pressed');
      // codigo para abrir a irrigação com mqtt
      console.log(this.state.cliente);
      this.state.cliente.publish('5954326/status', 'fechar', 0, false);
      this.setState({ status: false });
    };

    storeError = () => {
      Alert.alert('Estourou erro porra');
    };
  }

  // chamado ao entrar no aplicativo
  // componentDidMount() {
  // visualizar estado atual da aplicação (se mangueira esta aberta ou fechada)
  // Alert.alert('Entrou na aplicação');
  // mqtt.Client#publish('osBrabos', 'Mensageeeemm');
  // client.publish(
  //   'piique',
  //   'Hello mqtt',
  //   function (err) {
  //     Alert.alert(err);
  //   },
  //   function (err) {
  //     Alert.alert(err);
  //   }
  // );
  // }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <Text style={styles.title}>
            Irrigação ligará ao atingir 10% de umidade do solo
          </Text>
          <Separator />
          <Text style={styles.percentual}>
            Percentual de umidade do solo: {this.state.umidade}%
          </Text>
          <Text style={styles.status}>
            Irrigação {this.state.status === true ? 'aberta' : 'fechada'}
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
    marginTop: -30,
    textAlign: 'center',
    fontSize: 20,
  },
  status: {
    textAlign: 'center',
    marginTop: 40,
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
