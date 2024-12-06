import supabaseClient from "@/utils/supabase";
// import { sendEmailToAllUsers } from "./mailer";
// import { sendEmailToAllUsers } from "./apiNotifications";
// Fetch Jobs
export async function getJobs(token, { location, company_id, searchQuery, Profession, last5Days }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, saved: saved_jobs(id), company: companies(name,logo_url), Profession: Profession(name)")
    .eq("check", true);

  if (location) {
    query = query.eq("location", location);
  }

  if (company_id) {
    query = query.eq("company_id", company_id);
  }

  if (Profession) {
    query = query.eq("Profession", Profession);
  }

  if (searchQuery) {
    query = query.ilike("title", `%${searchQuery}%`);
  }

  // Only apply date filtering if last5Days is provided
  if (last5Days) {
    const dateFrom = new Date(new Date().setDate(new Date().getDate() - last5Days)).toISOString();
    query = query.gte('created_at', dateFrom);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}


// Fetch Jobs
export async function adminJobs(token) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select("*, saved: saved_jobs(id), company: companies(name,logo_url), Profession: Profession(name)")
    .is("check", "NULL");


  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Read Saved Jobs
export async function getSavedJobs(token) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("saved_jobs")
    .select("*, job: jobs(*, company: companies(name,logo_url), Profession: Profession(name))");

  if (error) {
    console.error("Error fetching Saved Jobs:", error);
    return null;
  }

  return data;
}

// Read single job
export async function getSingleJob(token, { job_id }) {
  const supabase = await supabaseClient(token);
  let query = supabase
    .from("jobs")
    .select(
      "*, company: companies(name,logo_url),Profession: Profession(name), applications: applications(*)"
    )
    .eq("id", job_id)
    .single();

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching Job:", error);
    return null;
  }

  return data;
}

// - Add / Remove Saved Job
export async function saveJob(token, { alreadySaved }, saveData) {
  const supabase = await supabaseClient(token);

  if (alreadySaved) {
    // If the job is already saved, remove it
    const { data, error: deleteError } = await supabase
      .from("saved_jobs")
      .delete()
      .eq("job_id", saveData.job_id);

    if (deleteError) {
      console.error("Error removing saved job:", deleteError);
      return data;
    }

    return data;
  } else {
    // If the job is not saved, add it to saved jobs
    const { data, error: insertError } = await supabase
      .from("saved_jobs")
      .insert([saveData])
      .select();

    if (insertError) {
      console.error("Error saving job:", insertError);
      return data;
    }

    return data;
  }
}

// - job isOpen toggle - (recruiter_id = auth.uid())
export async function updateHiringStatus(token, { job_id }, isOpen) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ isOpen })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Hiring Status:", error);
    return null;
  }

  return data;
}

//update Checking status
export async function updateCheckStatus(token, { job_id }, check) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("jobs")
    .update({ check })
    .eq("id", job_id)
    .select();

  if (error) {
    console.error("Error Updating Check Status:", error);
    return null;
  }

  return data;
}

// get my created jobs
export async function getMyJobs(token, { recruiter_id }) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .select("*, company: companies(name,logo_url), Profession: Profession(name)")
    .eq("recruiter_id", recruiter_id);

  if (error) {
    console.error("Error fetching Jobs:", error);
    return null;
  }

  return data;
}

// Delete job
export async function deleteJob(token, { job_id }) {
  const supabase = await supabaseClient(token);

  const { data, error: deleteError } = await supabase
    .from("jobs")
    .delete()
    .eq("id", job_id)
    .select();

  if (deleteError) {
    console.error("Error deleting job:", deleteError);
    return data;
  }

  return data;
}

// export async function addNewJob(token, _, jobData) {
//   const supabase = await supabaseClient(token);
//   const { data, error } = await supabase
//     .from("jobs")
//     .insert([jobData])
//     .select();

//   if (error) {
//     console.error(error);
//     throw new Error("Error Creating Job");
//   }

//   // Send email notification to all users
//   const subject = "New Job Posted: " + jobData.title;
//   const htmlContent = `<h3>A new job has been posted: ${jobData.title}</h3><p>${jobData.description}</p>`;
//   await sendEmailToAllUsers(subject, htmlContent);

//   return data;
// }








// - post job
export async function addNewJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const { data, error } = await supabase
    .from("jobs")
    .insert([jobData])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error Creating Job");
  }

  return data;
}


// // Fetch Number of Jobs
// export async function adminJobsCount(token) {
//   const supabase = await supabaseClient(token);
//   let query = supabase
//     .from("jobs")
//     .select("*, saved: saved_jobs(id), company: companies(name,logo_url)");


//   const { data, error } = await query;

//   if (error) {
//     console.error("Error fetching Jobs:", error);
//     return null;
//   }


//   return data;
// }

// cretae new user
export async function addNewUser({ token, email, location, is_candidate }) {
  if (!email || !location) {
    console.error("Email or location is missing!");
    return;
  }
  
  const supabase = await supabaseClient(token); // Ensure token is correct
  console.log("UserData passed to Supabase:", { email, location, is_candidate });

  const { data, error } = await supabase
    .from('User')
    .insert([{
      email: email,
      location: location,
      is_candidate: is_candidate,
    }])
    .select(); // Ensure this is selecting after insertion to return inserted data
        
  if (error) {
    console.error("Error creating user in Supabase:", error.message);
    throw new Error(error.message || "Error creating user in Supabase");
  }

  return data;
}
