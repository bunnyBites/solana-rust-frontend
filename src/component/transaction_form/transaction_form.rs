#![allow(non_snake_case)]
use std::rc::Rc;

use dioxus::prelude::*;

use crate::{api::solana_service, util::basic_util};

pub fn TransactionForm(cx: Scope, set_is_loading: Rc<dyn Fn(bool)>) -> Element {
    cx.render(rsx!(
        form {
            class: "container",
            onsubmit: move |event| {
                let prepared_values = basic_util::prepare_form_values(event.values.clone());
                set_is_loading(true);

                let cloned_set_is_loading = set_is_loading.clone();
                async move {
                    if let Ok(response) = solana_service::transfer_sol(prepared_values).await {
                        log::info!("{}", response);
                        cloned_set_is_loading(false);
                    }else {
                        log::info!("Failed to transfer");
                        cloned_set_is_loading(false);
                    }
                }
            },

            // Amount to send (SOL) input
            InputGroup {
                field_type: "number",
                label: "Amount(in SOL) to send",
                id: "sol_to_send",
            }

            // send Sol to input
            InputGroup {
                field_type: "text",
                label: "Send SOL to (Public key)",
                id: "to_pubkey",
            }

            // send button
            button {
                class: "btn btn-info btn-lg",
                r#type: "submit",
                "Send"
            }
        }
    ))
}

#[component]
fn InputGroup<'a>(cx: Scope, field_type: &'a str, label: &'a str, id: &'a str) -> Element {
    cx.render(rsx!(
        div {
            class: "form-group my-5 text-start",
            label {
                class: "fs-3",
                r#for: &id[..],
                &label[..],
            }
            input {
                r#type: &field_type[..],
                id: &id[..],
                class: "form-control",
                name: &id[..],
                required: true,
            }
        }
    ))
}
