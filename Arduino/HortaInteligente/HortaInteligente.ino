
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

//defines - mapeamento de pinos do NodeMCU
#define D0 16
#define D1 5
#define D2 4
#define D3 0
#define D4 2
#define D5 14
#define D6 12
#define D7 13
#define D8 15
#define D9 3
#define D10 1

// configurações MQTT
#define TOPICO_SUBSCRIBE "5954326/status" //tópico MQTT de escuta para ligar e desligar irrigação
#define TOPICO_PUBLISH "5954326/umidade"  //tópico MQTT de envio de informações para Broker
// servidor broker online. Para visualizar na web acesse o link http://www.hivemq.com/demos/websocket-client/?
const char *mqtt_server = "broker.mqtt-dashboard.com";

// configurações de conexão local do WiFi
const char *ssid = "VIVOFIBRA-9422"; // retirar isso
const char *password = "33946422";   // retirar isso

//const char* ssid = "NOME_REDE_WIFI";
//const char* password = "SENHA_REDE_WIFI";

//const char* ssid = "GVT-3508";
//const char* password = "5403000139";
//const char* ssid = "Silvana_casa";
//const char* password = "14061949";

WiFiClient espClient;
PubSubClient client(espClient);
unsigned long lastMsg = 0;
#define MSG_BUFFER_SIZE (200)

// declara variaveis a serem utilizadas
float UmidadePercentualLida;
int UmidadePercentualTruncada;
char msg[MSG_BUFFER_SIZE];
int value = 0;

void setup_wifi()
{

  delay(10);
  // We start by connecting to a WiFi network
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  randomSeed(micros());

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

//Função: faz a leitura do nível de umidade
//Parâmetros: nenhum
//Retorno: umidade percentual (0-100)
//Observação: o ADC do NodeMCU permite até, no máximo, 3.3V. Dessa forma,
//            para 3.3V, obtem-se (empiricamente) 978 como leitura de ADC
float FazLeituraUmidade(void)
{
  int ValorADC;
  float UmidadePercentual;

  ValorADC = analogRead(0); //978 -> 3,3V
  Serial.print("[Leitura ADC] ");
  Serial.println(ValorADC);

  //Quanto maior o numero lido do ADC, menor a umidade.
  //Sendo assim, calcula-se a porcentagem de umidade por:
  //
  //   Valor lido                 Umidade percentual
  //      _    0                           _ 100
  //      |                                |
  //      |                                |
  //      -   ValorADC                     - UmidadePercentual
  //      |                                |
  //      |                                |
  //     _|_  978                         _|_ 0
  //
  //   (UmidadePercentual-0) / (100-0)  =  (ValorADC - 978) / (-978)
  //      Logo:
  //      UmidadePercentual = 100 * ((150-ValorADC) / 150)

  UmidadePercentual = 100 * ((180 - (float)ValorADC) / 180);
  Serial.print("[Umidade Percentual] ");
  Serial.print(UmidadePercentual);
  Serial.println("%");

  return UmidadePercentual;
}

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message recebida [");
  Serial.print(topic);
  Serial.print("] ");

  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
  }
  Serial.println();

  if (!strcmp(topic, TOPICO_SUBSCRIBE))
  {
    if (!strncmp((char *)payload, "abrir", length))
    {
      digitalWrite(D0, HIGH); // LIGA IRRIGAÇÃO
      Serial.println("Irrigação ligada");
    }
    else if (!strncmp((char *)payload, "fechar", length))
    {
      digitalWrite(D0, LOW); // DESLIGA IRRIGAÇÃO
      Serial.println("Irrigação desligada");
    }
  }
}

void reconnect()
{
  // Loop until we're reconnected
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    // Create a random client ID
    String clientId = "ESP8266Client-";
    clientId += String(random(0xffff), HEX);
    // Attempt to connect
    if (client.connect(clientId.c_str()))
    {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish(TOPICO_PUBLISH, "NodeMcu Conectado");
      // ... and resubscribe
      client.subscribe(TOPICO_SUBSCRIBE);
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

void setup()
{
  pinMode(BUILTIN_LED, OUTPUT); // Initialize the BUILTIN_LED pin as an output
  pinMode(D0, OUTPUT);
  pinMode(D1, OUTPUT);
  pinMode(D2, OUTPUT);

  //  digitalWrite(D0, LOW);
  //  digitalWrite(D1, LOW);
  //  digitalWrite(D2, LOW);
  digitalWrite(BUILTIN_LED, HIGH);

  Serial.begin(9600);
  setup_wifi();
  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop()
{

  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  UmidadePercentualLida = FazLeituraUmidade();            // faz leitura da umidade
  UmidadePercentualTruncada = (int)UmidadePercentualLida; //trunca umidade como número inteiro

  dtostrf(UmidadePercentualLida, 6, 2, msg);

  client.publish(TOPICO_PUBLISH, msg);

  delay(1000);
}
