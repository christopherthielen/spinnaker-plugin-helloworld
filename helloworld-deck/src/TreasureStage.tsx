import {
  AccountService,
  ExecutionDetailsSection,
  ExecutionDetailsTasks,
  FormikFormField,
  FormikSpelContext,
  FormikSpelContextProvider,
  FormikStageConfig,
  HelpField,
  IExecutionDetailsSectionProps,
  IStageConfigProps,
  IStageTypeConfig,
  RegionSelectField,
  RegionSelectInput,
  SelectInput,
  TextInput,
  useData,
  IFormikStageConfigInjectedProps,
} from '@spinnaker/core';
import React from 'react';
import './HelloWorldStage.less';

interface ITreasureStateConfig {
  buildFolder: string;
  rootFolder: string;
  region: string;
  hostname: string;
  environment: string;
  account: string;
  buildUrl: string;
}

function TreasureStageConfigForm(props: IFormikStageConfigInjectedProps) {
  const { formik } = props;
  const account = formik.values.environment;
  const regions = useData(() => AccountService.getRegionsForAccount(account), [], [account]);

  return (
    <>
      <FormikFormField
        name="buildFolder"
        label="Build Folder"
        required={true}
        help={<HelpField content="The build folder" />}
        input={props => <TextInput placeholder="build" {...props} />}
      />

      <FormikFormField
        name="rootFolder"
        label="Root Folder"
        required={true}
        help={<HelpField content="public or private" />}
        input={props => <SelectInput options={['public', 'private']} {...props} />}
      />

      <FormikFormField
        name="environment"
        label="Environment"
        required={true}
        input={props => <SelectInput options={['prod', 'test']} {...props} />}
      />

      <FormikFormField
        name="region"
        label="Destination Region"
        required={true}
        input={props => <RegionSelectInput account={account} regions={regions.result} {...props} />}
      />
    </>
  );
}

function TreasureStateConfig(props: IStageConfigProps) {
  return (
    <FormikSpelContextProvider value={true}>
      <FormikStageConfig
        {...props}
        onChange={props.updateStage}
        render={props => <TreasureStageConfigForm {...props} />}
      />
    </FormikSpelContextProvider>
  );
}

export function TreasureStageDetails(props: IExecutionDetailsSectionProps & { title: string }) {
  return (
    <ExecutionDetailsSection name={props.name} current={props.current}>
      <div className="helloworld v2">
        <p>{props.stage.outputs.message}</p>
      </div>
    </ExecutionDetailsSection>
  );
}

export const treasureDeployStage: IStageTypeConfig = {
  key: 'treasureDeploy',
  alias: 'preconfiguredJob',
  label: `Treasure Deploy (EXPERIMENTAL)`,
  description: 'Publishes static assets to Treasure [http://go/treasure](http://go/treasure)',
  component: TreasureStateConfig, // stage config
  executionDetailsSections: [TreasureStageDetails, ExecutionDetailsTasks],
};

export namespace TreasureStageDetails {
  export const title = 'helloWorld';
}
