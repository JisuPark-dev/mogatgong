export class ApiServiceBase {

  constructor() {
  }

  buildJsonBlob(jsonObj: any) {
    const json = JSON.stringify(jsonObj)
    const blob = new Blob([json], {
      type: 'application/json'
    })
    return blob
  }


}

