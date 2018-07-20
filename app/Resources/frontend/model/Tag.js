export default class Tag {

    constructor (hydra) {
        this.id         = hydra['@id'];
        this.name       = hydra['name'];
        this.watchLinks = hydra['watchlinks'];
        this.children   = hydra['duplicates'];
    }

}
