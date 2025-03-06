export class AccountPlansViewDto {
  id: string;
  price: any;
  type: string;
  duration: string;
  name: string;
  constructor(
    id: string,
    price: any,
    type: string,
    duration: string,
    name: string,
  ) {
    this.price = price;
    this.type = type;
    this.duration = duration;
    this.name = name;
    this.id = id;
  }
}
