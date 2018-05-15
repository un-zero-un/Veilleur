export default class Link {

    constructor(hydra) {
        this.id          = hydra['@id'];
        this.name        = hydra['name'];
        this.description = hydra['description'];
        this.url         = hydra['url'];
        this.image       = hydra['image'];

        this.createdAt   = new Date(hydra['createdAt']);
    }

}