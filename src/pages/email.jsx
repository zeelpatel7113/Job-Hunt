import React from "react";
import { Resend } from 'resend';


const Email = () => {
    const resend = new Resend('re_GwrFUL9q_H5YBuVmzqfRCRM1zaUCBLCkC');
    (async function () {
        const { data, error } = await resend.emails.send({
          from: 'Job-Hunt <zeelppatel21@gnu.ac.in>',
          to: ['zeel6017@gnu.ac.in'],
          subject: 'Hello World',
          html: '<strong>It works!</strong>',
        });
      
        if (error) {
          return console.error({ error });
        }
      
        console.log({ data });
      })();
  return <div>Email</div>;
};

export default Email;
