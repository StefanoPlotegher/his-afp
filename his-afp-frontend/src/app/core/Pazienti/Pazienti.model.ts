export interface Paziente {
  id: string;
  nome: string;
  cognome: string;
  braccialetto: string;
  eta: number;
  codiceColore: string;
  note: string;
  patologia: string;
}

export interface PazienteDTO {
  id: number;
  braccialetto: string;
  dataOraIngresso: string;
  stato: string;
  noteTriage: string;
  patologiaCode: string;
  nome: string;
  cognome: string;
  dataNascita: string;
  sex: string;
  codiceFiscale: string;
  patologiaDescrizione: string;
  coloreCode: string;
  coloreHex: string;
  coloreNome: string;
  modalitaArrivoCode: string;
  modalitaArrivoDescrizione: string;
  indirizzoVia:string;
  indirizzoCivico:string;
  comune:string;
  provincia:string;
}

export interface PatientAdmission{
  anagrafica:{
    nome: string;
    cognome: string;
    dataNascita: string;
    codiceFiscale: string;
    sesso: string;
  };
  sanitaria:{
    patologia: string;
    codiceColore: string;
    modArrivo: string;
    noteTriage: string;
  };
  residenza:{
    via:string;
    civico:string;
    comune:string;
    provincia:string;
  };
}

export interface PatientAdmissionRes{
  id: number;
  braccialetto: string;
}


export interface Anagrafica {
  id: number
  codice_fiscale: string
  nome: string
  cognome: string
  data_nascita: string
  sex: string
  indirizzo_via: string
  indirizzo_civico: string
  comune: string
  provincia: string
  created_at: string
}