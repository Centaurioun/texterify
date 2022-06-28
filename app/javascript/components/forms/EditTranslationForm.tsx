import { Form, FormInstance, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import * as React from "react";
import { IGetKeyResponse, KeysAPI } from "../api/v1/KeysAPI";
import { IGetLanguagesResponse } from "../api/v1/LanguagesAPI";
import { ITranslation, TranslationsAPI } from "../api/v1/TranslationsAPI";
import { ErrorUtils } from "../ui/ErrorUtils";
import { Loading } from "../ui/Loading";
import { TranslationUtils } from "../utilities/TranslationUtils";

export interface IEditTranslationFormProps {
    projectId: string;
    languagesResponse: IGetLanguagesResponse;
    keyResponse: IGetKeyResponse;
    selectedLanguageId: string;
    selectedExportConfigId: string;
    formId?: string;
    hideDefaultSubmitButton?: boolean;
    clearFieldsAfterSubmit?: boolean;
    onSuccess(): void;
}

interface IFormValues {
    other: string;
    zero?: string;
    one?: string;
    two?: string;
    few?: string;
    many?: string;
}

export function EditTranslationForm(props: IEditTranslationFormProps) {
    const [translation, setTranslation] = React.useState<ITranslation>(null);
    const [translationLoading, setTranslationLoading] = React.useState<boolean>(true);

    const formRef = React.createRef<FormInstance>();

    React.useEffect(() => {
        setTranslationLoading(true);

        try {
            const translationForLanguage = TranslationUtils.getTranslationForLanguage({
                languageId: props.selectedLanguageId,
                keyResponse: props.keyResponse,
                exportConfigId: props.selectedExportConfigId
            });

            setTranslation(translationForLanguage);
        } catch (error) {
            console.error();
            ErrorUtils.showError("Failed to load translation");
        }

        setTranslationLoading(false);
    }, [props.selectedLanguageId]);

    React.useEffect(() => {
        formRef.current?.setFieldsValue({
            zero: {
                value: translation.attributes.zero
            },
            one: {
                value: translation.attributes.one
            },
            two: {
                value: translation.attributes.two
            },
            few: {
                value: translation.attributes.few
            },
            many: {
                value: translation.attributes.many
            },
            other: {
                value: translation.attributes.content
            }
        });
    }, [translation, formRef]);

    const selectedLanguage = props.languagesResponse.data.find((language) => {
        return language.id === props.selectedLanguageId;
    });

    const supportsPluralForm =
        selectedLanguage.attributes.supports_plural_zero ||
        selectedLanguage.attributes.supports_plural_one ||
        selectedLanguage.attributes.supports_plural_two ||
        selectedLanguage.attributes.supports_plural_few ||
        selectedLanguage.attributes.supports_plural_many;

    let autoFocusItem: "zero" | "one" | "two" | "few" | "many" | "other";
    if (selectedLanguage.attributes.supports_plural_zero) {
        autoFocusItem = "zero";
    } else if (selectedLanguage.attributes.supports_plural_one) {
        autoFocusItem = "one";
    } else if (selectedLanguage.attributes.supports_plural_two) {
        autoFocusItem = "two";
    } else if (selectedLanguage.attributes.supports_plural_few) {
        autoFocusItem = "few";
    } else if (selectedLanguage.attributes.supports_plural_many) {
        autoFocusItem = "many";
    } else {
        autoFocusItem = "other";
    }

    if (translationLoading) {
        return <Loading />;
    }

    return (
        <>
            {/* <TranslationCard
                projectId={props.projectId}
                keyResponse={this.state.editTranslationKeyReponse}
                languagesResponse={this.state.languagesResponse}
                defaultSelected={this.state.editTranslationLanguageId}
                exportConfigId={this.state.editTranslationExportConfigId}
                hideLanguageSelection
                hideSaveButton
                ref={(ref) => {
                    return (this.translationCardRef = ref);
                }}
                onChange={(changed: boolean) => {
                    this.setState({ editTranslationContentChanged: changed });
                }}
            /> */}
            <Form
                onFinish={async (values: IFormValues) => {
                    try {
                        const response = await TranslationsAPI.createTranslation({
                            projectId: props.projectId,
                            languageId: selectedLanguage.id,
                            keyId: props.keyResponse.data.id,
                            zero: values.zero,
                            one: values.one,
                            two: values.two,
                            few: values.few,
                            many: values.many,
                            content: values.other
                        });

                        if (response.error) {
                            ErrorUtils.showError(`Error: ${response.error}`);
                        } else {
                            message.success("Succesfully updated translation.");

                            if (props.onSuccess) {
                                props.onSuccess();
                            }

                            if (props.clearFieldsAfterSubmit) {
                                formRef.current?.resetFields();
                            }
                        }
                    } catch (error) {
                        console.error(error);
                        ErrorUtils.showError("Failed to update translation");
                    }
                }}
                style={{ maxWidth: "100%", minWidth: 0 }}
                id={props.formId}
                initialValues={
                    translation && {
                        zero: translation.attributes.zero,
                        one: translation.attributes.one,
                        two: translation.attributes.two,
                        few: translation.attributes.few,
                        many: translation.attributes.many,
                        other: translation.attributes.content
                    }
                }
            >
                {props.keyResponse.data.attributes.pluralization_enabled &&
                    selectedLanguage.attributes.supports_plural_zero && (
                        <>
                            <h3>Zero</h3>
                            <Form.Item name="zero" rules={[{ required: false }]}>
                                <TextArea placeholder="Your translation" autoFocus={autoFocusItem === "zero"} />
                            </Form.Item>
                        </>
                    )}

                {props.keyResponse.data.attributes.pluralization_enabled &&
                    selectedLanguage.attributes.supports_plural_one && (
                        <>
                            <h3>One</h3>
                            <Form.Item name="one" rules={[{ required: false }]}>
                                <TextArea placeholder="Your translation" autoFocus={autoFocusItem === "one"} />
                            </Form.Item>
                        </>
                    )}

                {props.keyResponse.data.attributes.pluralization_enabled &&
                    selectedLanguage.attributes.supports_plural_two && (
                        <>
                            <h3>Two</h3>
                            <Form.Item name="two" rules={[{ required: false }]}>
                                <TextArea placeholder="Your translation" autoFocus={autoFocusItem === "two"} />
                            </Form.Item>
                        </>
                    )}

                {props.keyResponse.data.attributes.pluralization_enabled &&
                    selectedLanguage.attributes.supports_plural_few && (
                        <>
                            <h3>Few</h3>
                            <Form.Item name="few" rules={[{ required: false }]}>
                                <TextArea placeholder="Your translation" autoFocus={autoFocusItem === "few"} />
                            </Form.Item>
                        </>
                    )}

                {props.keyResponse.data.attributes.pluralization_enabled &&
                    selectedLanguage.attributes.supports_plural_many && (
                        <>
                            <h3>Many</h3>
                            <Form.Item name="many" rules={[{ required: false }]}>
                                <TextArea placeholder="Your translation" autoFocus={autoFocusItem === "many"} />
                            </Form.Item>
                        </>
                    )}

                {props.keyResponse.data.attributes.pluralization_enabled && supportsPluralForm && <h3>Other</h3>}
                <Form.Item name="other" rules={[{ required: false }]}>
                    <TextArea placeholder="Your translation" autoFocus={autoFocusItem === "other"} />
                </Form.Item>
            </Form>
        </>
    );
}
