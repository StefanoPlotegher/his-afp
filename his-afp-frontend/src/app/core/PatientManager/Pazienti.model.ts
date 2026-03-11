export interface Paziente {
  id: string;
  nome: string;
  cognome: string;
  braccialetto: string;
  eta: number;
  sex: string;
  codiceColore: string;
  note: string;
  patologia: string;
}

export interface PazienteDTO {
  id: number
  braccialetto: string
  dataOraIngresso: string
  stato: string
  noteTriage: string
  patologiaCode: string
  nome: string
  cognome: string
  dataNascita: string
  codiceFiscale: string
  sex: string
  patologiaDescrizione: string
  coloreCode: string
  coloreHex: string
  coloreNome: string
  modalitaArrivoCode: string
  modalitaArrivoDescrizione: string
}