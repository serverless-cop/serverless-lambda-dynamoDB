import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Stack} from "aws-cdk-lib";
import {TodoApis} from "../lib/construct/todo-apis";



export class TodoAppStack extends Stack {

  public todoApis:TodoApis
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.todoApis = new TodoApis(this,id)

  }


}
