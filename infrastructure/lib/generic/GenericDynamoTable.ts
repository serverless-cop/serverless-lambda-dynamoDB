import {Stack, StackProps} from "aws-cdk-lib";
import {AttributeType, Table} from "aws-cdk-lib/aws-dynamodb";
import {Effect, IGrantable, PolicyStatement} from "aws-cdk-lib/aws-iam";
import {Construct} from "constructs";

export interface GenericTableProps {
    tableName: string
    primaryKey: string
    secondaryIndexes?: string[]
}

export class GenericDynamoTable extends Construct {

    public table: Table;
    private props: GenericTableProps

    public constructor(scope: Construct, id: string, props: GenericTableProps){
        super(scope, id)
        this.props = props


        this.table = new Table(this, this.props.tableName, {
            partitionKey: {
                name: this.props.primaryKey,
                type: AttributeType.STRING
            },
            tableName: this.props.tableName
        })
    }

    private addSecondaryIndexes(){
        if (this.props.secondaryIndexes) {
            for (const secondaryIndex of this.props.secondaryIndexes) {
                this.table.addGlobalSecondaryIndex({
                    indexName: secondaryIndex,
                    partitionKey: {
                        name: secondaryIndex,
                        type: AttributeType.STRING
                    }
                })
            }
        }
    }

}
