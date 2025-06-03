void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:
  if (Serial.available()){
    Serial.print("Recebido dados: ");
    Serial.print(Serial.readString());
  }

  // delay(2000);
  // Serial.println("temp:2820;umid:4000;qual:1190;sfan:1");
}
